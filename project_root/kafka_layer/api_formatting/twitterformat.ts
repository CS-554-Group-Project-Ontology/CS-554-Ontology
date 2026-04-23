/*
Essential Data X:
{
  "data": {
    "author_id": "2244994945",
    "created_at": "Wed Jan 06 18:40:40 +0000 2021",
    "id": "1346889436626259968",
    "text": "Learn how to use the user Tweet timeline and user mention timeline endpoints in the X API v2 to explore Tweet\\u2026 https:\\/\\/t.co\\/56a0vZUx7i",
    "username": "XDevelopers"
  },
}
*/

export interface StructuredTwitterPost {
  author_id?: string;
  created_at: string;
  text: string;
  username: string;
}
