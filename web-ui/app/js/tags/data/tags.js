define(['flight/lib/component', 'page/events'], function (defineComponent, events) {
  'use strict';

  var DataTags = defineComponent(dataTags);

      DataTags.all = {
        name: 'all',
        ident: '8752888923742657436',
        query: 'in:all',
        default: true,
        counts:{
          total:0,
            read:0,
            starred:0,
            replied:0
        }
      };

  return DataTags;

  function dataTags() {
    function sendTagsBackTo(on, params) {
      return function(data) {
        data.push(DataTags.all);
        on.trigger(params.caller, events.tags.received, {tags: data});
      };
    }

    this.defaultAttrs({
      tagsResource: '/tags'
    });

    this.fetchTags = function(event, params) {
      $.ajax(this.attr.tagsResource)
        .done(sendTagsBackTo(this, params));
    };

    this.after('initialize', function () {
      this.on(document, events.tags.want, this.fetchTags);
    });
  }
});
