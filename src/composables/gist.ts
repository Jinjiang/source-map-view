import { request } from "@octokit/request"

let accessToken = ''

export const initAccessToken = async () => {
  // TODO: get GitHub access token
  accessToken = 'test'
}

export type File = {
  id: string
  content: string
}

export const getGistFiles = async (gistId: string): Promise<File[]> => {
  if (!accessToken) {
    return []
  }

  if (accessToken === 'test') {
    const response = await fetch('./test.json')
    return await response.json()
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
