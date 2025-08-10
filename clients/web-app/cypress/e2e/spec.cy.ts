describe('template spec', () => {
  // beforeEach(() => {
  //   cy.visit('http://localhost:8080') // Replace with your actual URL

  //   // Start session after the page loads
  //   cy.window().then((win) => {
  //     // cy.get('.mtt-debugger-label')
  //     //   .trigger('mousedown')
  //     //   .wait(100)
  //     //   .trigger('mouseup')
  //     //   .wait(100);

  //     // cy.get('.mp-session-debugger-popover-button.mp-start-recording')
  //     //   .click()
  //     //   .wait(1500)
  //     cy.intercept('POST', '/v0/radar/debug-sessions/start*').as('startRequest');

  //     cy.get('.mtt-button.medium-text').click().wait('@startRequest');
  //   });
  // });

  afterEach(() => {
    cy.get('.mtt-debugger-label')
      .trigger('mousedown')
      .wait(100)
      .trigger('mouseup')
      .wait(100);

    cy.get('.mp-session-debugger-popover-button.mp-stop-recording')
      .click()
      .wait(10000)
  });

  // it('Should not throw error', () => {
  //   cy.visit('http://localhost:8080')

  //   cy.intercept('POST', '/v0/radar/debug-sessions/start*').as('startRequest');

  //   cy.get('.mtt-button.medium-text').click().wait('@startRequest');


  //   let aiRequestSucceeded = true;

  //   cy.intercept('POST', '/v1/timegate/dialogue-hub/openrouter/message*', (req) => {
  //     req.continue((res) => {
  //       if (res.statusCode >= 400) {
  //         aiRequestSucceeded = false; // Stop when error occurs
  //       }
  //     });
  //   }).as('startRequest');

  //   // cy.get('.mtt-button.medium-text').click();

  //   cy.get('.mtt-question-button.medium-text').first().click()

  //   cy.get('.mtt-suggestions-list-header', { timeout: 10000 }).should('be.visible')

  //   cy.wait('@startRequest', { timeout: 80000 })
  //     .then(() => {
  //       if (!aiRequestSucceeded) {
  //         throw Error('Test failed')
  //       }
  //     })
  // });

  // it('Should throw error', () => {
  //   cy.visit('http://localhost:8080')

  //   cy.intercept('POST', '/v0/radar/debug-sessions/start*').as('startRequest');

  //   // cy.get('.mtt-button.medium-text').click().wait('@startRequest');

  //   let aiRequestSucceeded = true;

  //   cy.intercept('POST', '/v1/timegate/dialogue-hub/openrouter/message*', (req) => {
  //     req.continue((res) => {
  //       if (res.statusCode >= 400) {
  //         aiRequestSucceeded = false; // Stop when error occurs
  //       }
  //     });
  //   }).as('startRequest');

  //   // cy.get('.mtt-button.medium-text').click().wait(100);

  //   cy.get('.cs-message-input__content-editor-wrapper').click()
  //     .trigger('mousedown')
  //     .wait(100)
  //     .trigger('mouseup')
  //     .wait(100)
  //     .type('BUG');

  //   cy.get('.cs-button').click()
  //     .wait('@startRequest', { timeout: 80000 })
  //       .then(() => {
  //         if (aiRequestSucceeded) {
  //           throw Error('Test failed')
  //         }
  //       })
  // });


  it('Should not fail', () => {
    cy.visit('http://localhost:8080')

    cy.intercept('POST', '/v0/radar/debug-sessions/start*').as('startRequest');

    // cy.get('.mtt-button.medium-text').click().wait('@startRequest');


    cy.get(':nth-child(3) > .mtt-character-card').click().wait('@startRequest');

    // cy.get('.mtt-button.medium-text').click().wait(500);

    cy.get('.mtt-question-button.medium-text').first().click()

    cy.get('.mtt-suggestions-list-header', { timeout: 5000 }).should('be.visible')

    let keepClicking = true;

    // Intercept the network call you expect after the click
    cy.intercept('POST', '/v1/timegate/dialogue-hub/openrouter/message*', (req) => {
      req.continue((res) => {
        if (res.statusCode >= 400) {
          keepClicking = false; // Stop when error occurs
        }
      });
    }).as('startRequest');

    function clickUntilFail() {
      if (!keepClicking) return;

      cy.get('.mtt-suggestions-list-header', { timeout: 10000 })
        .should('be.visible')

      cy.get('.mtt-suggestions-list > :nth-child(1)')
        .click()
        .wait('@startRequest', { timeout: 80000 })
        .then(() => {
          clickUntilFail(); // Recurse if still OK
        });
    }

    // Start the loop
    clickUntilFail();
  });
})
