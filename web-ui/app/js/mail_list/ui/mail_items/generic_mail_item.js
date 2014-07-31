/*global _ */

define(
  [
    'flight/lib/component',
    'views/templates',
    'helpers/view_helper',
    'mail_list/ui/mail_items/mail_item',
    'page/events'
  ],

  function (defineComponent, templates, viewHelpers, mailItem, events) {
    'use strict';

    return defineComponent(genericMailItem, mailItem);

    function genericMailItem() {
      this.status = {
        READ: 'read'
      };

      function isOpeningOnANewTab(ev) {
        return ev.metaKey || ev.ctrlKey || ev.which === 2;
      }

      this.triggerOpenMail = function (ev) {
        if (isOpeningOnANewTab(ev)) {
          updateMailStatusToRead.call(this);
          return;
        }
        this.trigger(document, events.ui.mail.open, { ident: this.attr.ident });
        this.trigger(document, events.router.pushState, { mailIdent: this.attr.ident });
        ev.preventDefault(); // don't let the hashchange trigger a popstate
      };

      function updateMailStatusToRead() {
        if (!_.contains(this.attr.mail.status, this.status.READ)) {
          this.trigger(document, events.mail.read, { ident: this.attr.ident, tags: this.attr.mail.tags });
          this.attr.mail.status.push(this.status.READ);
          this.$node.addClass(viewHelpers.formatStatusClasses(this.attr.mail.status));
        }
      }

      this.openMail = function (ev, data) {
        if (data.ident !== this.attr.ident) {
          return;
        }
        updateMailStatusToRead.call(this);

        this.trigger(document, events.ui.mail.updateSelected, { ident: this.attr.ident });
      };

      this.updateTags = function(ev, data) {
        if(data.ident === this.attr.ident){
          this.attr.tags = data.tags;
          if(!_.contains(this.attr.tags, this.attr.tag)) {
            this.teardown();
          } else {
            this.render();
          }
        }
      };

      this.deleteMail = function(ev, data) {
        if(data.mail.ident === this.attr.ident){
          this.teardown();
        }
      };

      this.render = function () {
        this.attr.tagsForListView = _.without(this.attr.tags, this.attr.tag);
        var mailItemHtml = templates.mails.single(this.attr);
        this.$node.html(mailItemHtml);
        this.$node.addClass(this.attr.statuses);
        this.attr.selected && this.select();
        this.on(this.$node.find('a'), 'click', this.triggerOpenMail);
      };

      this.after('initialize', function () {
        this.initializeAttributes();
        this.render();
        this.attachListeners();

        if (this.attr.isChecked) {
          this.checkCheckbox();
        }

        this.on(document, events.ui.composeBox.newMessage, this.unselect);
        this.on(document, events.ui.mail.open, this.openMail);
        this.on(document, events.ui.mail.updateSelected, this.updateSelected);
        this.on(document, events.mails.teardown, this.teardown);
        this.on(document, events.mail.tags.update, this.updateTags);
        this.on(document, events.mail.delete, this.deleteMail);
      });
    }
  }
);
