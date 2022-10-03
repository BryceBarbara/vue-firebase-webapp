export interface GetWelcomeMessageRequest {
  /**
   * The locale to use for the welcome message.
   */
  locale?: string
}

export interface GetWelcomeMessageResponse {
  /**
   * Contains the welcome message.
   */
  message: string
}

export interface CalculateSquareRequest {
  /**
   * The number to square.
   */
  input: number
}

export interface CalculateSquareResponse {
  /**
   * The square of the input.
   */
  output: number
}
