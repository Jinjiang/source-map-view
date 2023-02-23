import { request } from "@octokit/request"

const AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token'

const CLIENT_ID = '8924e1a858c1f5139e25'
const CLIENT_SECRET = '57610fa4d0210d402074e1619cdd8d21afe7aecf'

// for testing purposes
let accessToken = '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'

export const init = async () => {
  if (accessToken) {
    return
  }

  // get code param
  const currentUrl = new URL(location.href)
  const code = currentUrl.searchParams.get('code')

  // login
  if (!code) {
    const url = new URL(AUTHORIZE_URL)
    url.searchParams.append('client_id', CLIENT_ID)
    location.href = url.href
    return
  }

  // get access token
  const response = await fetch(ACCESS_TOKEN_URL, {
    method: 'POST',
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
    })
  })

  accessToken = (await response.json())?.access_token
}

export type File = {
  id: string
  content: string
}

export const getGistFiles = async (gistId: string): Promise<File[]> => {
  if (!accessToken) {
    return []
  }

  const response = await request(
    'GET /gists/{gist_id}', {
      headers: {
        authorization: `token ${accessToken}`
      },
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

