type CharInfo = {
  first: boolean
  sign: boolean
  continuation: number
  value: number
}

type ValueInfo = {
  length: number
  value: number
}

export type PointInfo = {
  name?: string
  source?: string
  generated: {
    line: number
    column: number
  }
  original: {
    line: number
    column: number
  }
}

export type LineInfo = PointInfo[]

/**
 * [A-Z] ->  0-25,
 * [a-z] -> 26-51,
 * [0-9] -> 52-61,
 *   +   ->    62,
 *   /   ->    63
 */
const convertCharToInt = (c: string): number => {
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".search(
    c
  );
}

/**
 * 100001, true  ->  continuation,  sign, 0
 * 000010, false -> !continuation,      , 2
 * 110010, true  ->  continuation, !sign, 9
 */
const convertNumberToInfo = (n: number, first: boolean): CharInfo => {
  const continuation = parseInt('100000', 2) & n;
  let value = parseInt('11111', 2) & n;
  let sign = false;

  if (first) {
    sign = (1 & n) === 1;
    value = value >> 1;
  }

  return {
    first,
    sign,
    continuation,
    value,
  };
}

/**
 * A  0 000000   0
 * B  1 000001  -0
 * C  2 000010   1
 * D  3 000011  -1
 * E             2
 * F            -2
 * G             3
 * H            -3
 * I             4
 * J            -4
 * K             5
 * L            -5
 * MOQSU         6~ 10
 * NPRTV        -6~-10
 * WYace        11~ 15
 * XZbdf       -11~-15
 *
 * g 32 100000   0 + ?
 * hijkl...
 */
const extractValue = (point: string): ValueInfo => {
  const length = point.length;
  let first = true;
  let step = 0;
  let totalValue = 0;
  let sign = false;
  let i = 0;

  for (i = 0; i < length; i++) {
    const c = point[i];
    const n = convertCharToInt(c);
    const charInfo = convertNumberToInfo(n, first);

    totalValue += charInfo.value * Math.pow(2, step);

    if (charInfo.first) {
      sign = charInfo.sign;
    }

    step += 6;
    if (charInfo.first) {
      step--;
    }
    if (charInfo.continuation) {
      step--;
    }

    if (charInfo.continuation) {
      first = false;
    } else {
      first = true;
      break;
    }
  }

  // console.log('VLQ:', i + 1, totalValue, sign)

  if (sign) {
    totalValue = -totalValue;
  }

  return {
    length: i + 1,
    value: totalValue,
  };
}

type Context = {
  generated: {
    line: number
    column: number
  }
  sourceIndex: number
  original: {
    line: number
    column: number
  }
  nameIndex: number
  files: string[]
  keywords: string[]
}

/**
 * point: "AAAAA"
 */
const parsePointString = (pointString: string, context: Context): PointInfo => {
  const values: number[] = [];
  const point: PointInfo = {
    generated: {
      line: -1,
      column: -1,
    },
    original: {
      line: -1,
      column: -1,
    },
  };

  let i = 0;
  while (pointString.length && i < 64) {
    i++;
    const valueInfo = extractValue(pointString);
    pointString = pointString.substring(valueInfo.length);
    values.push(valueInfo.value);
  }

  context.generated.column += values[0];
  point.generated.line = context.generated.line;
  point.generated.column = context.generated.column;

  if (values.length <= 1) {
    return point;
  }

  context.sourceIndex += values[1];
  context.original.line += values[2];
  context.original.column += values[3];

  point.source = context.files[context.sourceIndex];
  point.original.line = context.original.line;
  point.original.column = context.original.column;

  if (values.length <= 4) {
    return point;
  }

  context.nameIndex += values[4];
  point.name = context.keywords[context.nameIndex];

  return point;
}

/**
 * mappings: "AAAAA,BBBBB;CCCCC"
 */
const parseMappingsString = (mappingsString: string, context: Context) => {
  const lineStrings = mappingsString.split(";");
  const lines: LineInfo[] = [];

  lineStrings.forEach((line) => {
    if (line.length === 0) {
      context.generated.line++;
      return;
    }

    const pointMappings = line.split(",");
    lines.push(pointMappings.map(pointMapping => parsePointString(pointMapping, context)));
    context.generated.line++;
    context.generated.column = 0;
  });

  return lines;
}

export const parse = (input: string, files: string[], keywords: string[]): LineInfo[] => {
  const context: Context = {
    generated: {
      line: 0,
      column: 0,
    },
    sourceIndex: 0,
    original: {
      line: 0,
      column: 0,
    },
    nameIndex: 0,
    files,
    keywords
  };

  return parseMappingsString(input, context);
}
