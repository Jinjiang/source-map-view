import { request } from "@octokit/request"

export type File = {
  id: string
  content: string
}

const headers = {
  authorization: 'token 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'
}

export const getGistFiles = async (gistId: string): Promise<File[]> => {
  const response = await request(
    'GET /gists/{gist_id}', {
      headers,
      gist_id: gistId,
    }
  )
  const files = response.data.files
  const result: File[] = []
  for (const key in files) {
    result.push({
      id: files[key]!.filename!,
      content: files[key]!.content ?? '',
    })
  }
  return result
}
