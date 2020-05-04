import fetch, { RequestInfo, RequestInit } from 'node-fetch'

export function getFetch<T>(appAccessToken: string) {
  return async (input: RequestInfo, init?: RequestInit): Promise<T> => {
    return fetch(input, {
      headers: getHeaders(appAccessToken),
      ...init,
    }).then((res) => res.json())
  }
}

function getHeaders(appAccessToken: string) {
  return {
    Authorization: `Bearer ${appAccessToken}`,
    'Content-Type': 'application/json',
  }
}
