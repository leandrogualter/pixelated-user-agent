describeComponent('mail_view/ui/send_button', function () {

  describe('send button', function () {
    beforeEach(function () {
      setupComponent('<button />');
    });

    describe('when it is disabled', function () {
      beforeEach(function () {
        this.$node.prop('disabled', true);
      });

      it('gets enabled in a inputHasMail event', function () {
        $(document).trigger(Smail.events.ui.recipients.inputHasMail, { name: 'to' });

        expect(this.$node).not.toBeDisabled();
      });

      it('gets enabled in a recipients:updated where there are new recipients', function () {
        $(document).trigger(Smail.events.ui.recipients.updated, { newRecipients: ['a@b.c']});

        expect(this.$node).not.toBeDisabled();
      });
    });

    describe('multiple events', function () {
      it('gets enabled and remains enabled when a inputHasMail is followed by a recipients:updated with NO new recipients', function () {
        this.$node.prop('disabled', true);

        $(document).trigger(Smail.events.ui.recipients.inputHasMail, { name: 'to' });
        $(document).trigger(Smail.events.ui.recipients.updated, { newRecipients: [] });

        expect(this.$node).not.toBeDisabled();
      });

      it('gets enabled and remains enabled when a recipients:updated with recipients is followed by a inputHasNoMail', function () {
        this.$node.prop('disabled', true);

        $(document).trigger(Smail.events.ui.recipients.updated, { newRecipients: ['a@b.c']});
        $(document).trigger(Smail.events.ui.recipients.inputHasNoMail, { name: 'to' });

        expect(this.$node).not.toBeDisabled();
      });
    });

    describe('when it is enabled', function () {
      beforeEach(function () {
        this.$node.prop('disabled', false);
      });

      it('gets disabled in a inputHasNoMail', function () {
        $(document).trigger(Smail.events.ui.recipients.inputHasNoMail, { name: 'to' });

        expect(this.$node).toBeDisabled();
      });

      it('gets disabled in a recipients:updated without new recipients', function () {
        $(document).trigger(Smail.events.ui.recipients.updated, { newRecipients: []});

        expect(this.$node).toBeDisabled();
      });
    });

    describe('on click', function () {

      it ('asks for the recipients input to complete its current input', function () {
        var doCompleteInputEvent = spyOnEvent(document, Smail.events.ui.recipients.doCompleteInput);

        this.$node.click();

        expect(doCompleteInputEvent).toHaveBeenTriggeredOn(document);
      });
    });

    describe('after clicking', function () {
      beforeEach(function () {
        this.$node.click();
      });

      it('waits for ui:mail:recipientsUpdated to happen 3 times in the mail then sends the mail then stops listening to ui:mail:recipientsUpdated', function () {
        var sendMailEvent = spyOnEvent(document, Smail.events.ui.mail.send);
        spyOn(this.component, 'off');

        _.times(3, function () { $(document).trigger(Smail.events.ui.mail.recipientsUpdated) });;

        expect(sendMailEvent).toHaveBeenTriggeredOn(document);
        expect(this.component.off).toHaveBeenCalledWith(document, Smail.events.ui.mail.recipientsUpdated);
      });
    });
  });
});
