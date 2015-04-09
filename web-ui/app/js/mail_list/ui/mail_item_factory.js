/*
 * Copyright (c) 2014 ThoughtWorks, Inc.
 *
 * Pixelated is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pixelated is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pixelated. If not, see <http://www.gnu.org/licenses/>.
 */
'use strict';

define(
  [
    'mail_list/ui/mail_items/generic_mail_item',
    'mail_list/ui/mail_items/draft_item',
    'mail_list/ui/mail_items/sent_item'
  ],
  function (GenericMailItem, DraftItem, SentItem) {

    var MAIL_ITEM_TYPE = {
      'drafts': DraftItem,
      'sent': SentItem,
      'trash': GenericMailItem
    };

    var TEMPLATE_TYPE = {
      'drafts': 'draft',
      'sent': 'sent',
      'trash': 'trash'
    };

    var createAndAttach = function (nodeToAttachTo, mail, currentMailIdent, currentTag, isChecked) {
      var mailItemContainer = $('<li>', { id: 'mail-' + mail.ident});
      nodeToAttachTo.append(mailItemContainer);

      mail.currentTag = currentTag;
      var mailToCreate = MAIL_ITEM_TYPE[mail.mailbox] || GenericMailItem;
      mailToCreate.attachTo(mailItemContainer, {
        mail: mail,
        selected: mail.ident === currentMailIdent,
        tag: currentTag,
        isChecked: isChecked,
        templateType: TEMPLATE_TYPE[mail.mailbox] || 'single'
      });

    };

    return {
      createAndAttach: createAndAttach
    };
  }
);
