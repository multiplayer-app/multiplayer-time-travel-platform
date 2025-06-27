describe('template spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080') // Replace with your actual URL

    // Start session after the page loads
    cy.window().then((win) => {
      cy.get('.mtt-debugger-label')
        .trigger('mousedown')
        .wait(100) // optional, mimics holding the click
        .trigger('mouseup')
        .wait(100);

      cy.get('.mp-session-debugger-popover-button.mp-start-recording')
        .click()
        .wait(1500) // optional, mimics holding the click
      // .trigger('mouseup');

      // win.MultiplayerSessionDebugger.startSession({ name: 'CYPRESS' });
    });
  });

  afterEach(() => {
    cy.get('.mtt-debugger-label')
      .trigger('mousedown')
      .wait(100) // optional, mimics holding the click
      .trigger('mouseup')
      .wait(100);

    cy.get('.mp-session-debugger-popover-button.mp-stop-recording')
      .click()
      .wait(1500)

  });

  it('should perform some test actions', () => {
    // your test steps
    cy.get('.mtt-button.medium-text').click();

    // document.getElementsByClassName('mtt-button medium-text')[0].click()
    cy.contains('Hello there! 👋').should('be.visible');
  });
})
