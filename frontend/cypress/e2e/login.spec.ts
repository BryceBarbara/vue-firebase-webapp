context('Login', () => {
  it('Detects logging in', () => {
    cy.logout()
      .visit('/')
      .url()
      .should('eq', 'http://localhost:3333/')

    cy.get('[data-test=login-button]')
      .should('exist')

    // Login which app should detect
    cy.login()

    cy.get('[data-test=logout-button]')
      .should('exist')
  })

  it('Can log out', () => {
    cy.get('[data-test=logout-button]')
      .should('exist')
      .click()

    cy.get('[data-test=login-button]')
      .should('exist')
  })
})
