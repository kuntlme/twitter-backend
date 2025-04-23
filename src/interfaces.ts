export interface JWTUser {
      id: string
}

export interface GraphqlContext {
      user: JWTUser
}