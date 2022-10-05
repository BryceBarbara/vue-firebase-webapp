const Locators = {
  welcomeMessageRefreshButton: '[data-test=welcome-message-refresh-button]',
  welcomeMessageResult: '[data-test=welcome-message-result]',
  remoteMathInput: '[data-test=remote-math-input]',
  remoteMathSubmitButton: '[data-test=remote-math-submit-button]',
  remoteMathResultOutput: '[data-test=remote-math-result-output]',
  remoteMathResultWhen: '[data-test=remote-math-result-when]',
}

function normalizeNumberString(str: string) {
  return str.replace(/[^0-9.]/g, '')
}

context('API Test Page', () => {
  before(() => {
    cy.login()
      .visit('/api-test')
  })

  context('Welcome Message', () => {
    it('Can refresh welcome message', () => {
      cy.intercept('POST', '/*/*/getWelcomeMessage')
        .as('getWelcomeMessage')

      // The refresh button for the welcome message should be visible
      cy.get(Locators.welcomeMessageRefreshButton)
        .should('be.visible')

      // Clicking the refresh button should trigger a request to the API
      cy.get(Locators.welcomeMessageRefreshButton)
        .click()
        .wait('@getWelcomeMessage')

      // The result should be visible
      cy.get(Locators.welcomeMessageResult)
        .should('be.visible')
    })
  })

  context('Remote Math', () => {
    it('Can get accurate results', () => {
      const inputs = [123, 456]

      cy.intercept('POST', '/*/*/calculateSquare')
        .as('calculateSquare')

      for (const input of inputs) {
        cy.get(Locators.remoteMathInput)
          .clear()
          .type(input.toString())

        // Clicking the submit button should trigger a request to the API
        cy.get(Locators.remoteMathSubmitButton)
          .click()
          .wait('@calculateSquare')

        // The result should be visible
        cy.get(Locators.remoteMathResultWhen)
          .should('be.visible')
        cy.get(Locators.remoteMathResultOutput)
          .should('be.visible')
          .should((output) => {
            // The result should be accurate
            expect(normalizeNumberString(output.text())).to.eq((input * input).toString())
          })
      }
    })
  })
})
