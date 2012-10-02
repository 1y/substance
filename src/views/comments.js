sc.views.Comments = Dance.Performer.extend({

  // Events
  // ------

  events: {
    'click .insert-comment': '_insertComment',
    'click .comment': '_showComment'
  },

  // Handlers
  // --------

  _showComment: function(e) {
    var id = $(e.currentTarget).attr('data-id');
    var comment = this.model.document.annotations.content.nodes[id];
    
    function highlight() {
      unhighlight();
      $(e.currentTarget).addClass('active');

      // Highlight comment toggles in document
      _.each(comment.nodes, function(n) {
        $('#'+_.htmlId(n)+" .comments-toggle").addClass('highlighted');
      });
    }

    function unhighlight() {
      $(e.currentTarget).parent().find('.comment').removeClass('active');
      $('.content-node .comments-toggle').removeClass('highlighted');
    }

    // Highlight or unhighlight?
    $(e.currentTarget).hasClass('active') ? unhighlight() : highlight();

    return false;
  },

  _insertComment: function() {
    var selection = this.model.selection(),
        properties = {
          "content": $('#comment_content').val(),
          "nodes": selection
        };

    // TODO get pos from surface if there is one
    if (selection.length === 1) { // && isTextNode?
      // selectedNode = this.model.document.content.nodes[selection[0]];
      properties.pos = [0,4];
    }

    var op = {
      op: ["insert", {"id": "annotation:"+Math.uuid(), "type": "comment", "data": properties}],
      user: "michael",
    };

    this.model.document.annotations.apply(op);
    this.render();
    return false;
  },

  initialize: function(options) {
    this.documentView = options.documentView;
  },

  markers: function() {
    var node = this.model.node();
    var markers = [];

    if (!node) {
      markers.push({
        name: "Document",
        comments: []
      });
    }

    var annotations = this.model.document.getAnnotations(node);
    _.each(annotations, function(a) {
      markers.push({
        name: a.id,
        comments: this.model.document.getCommentsForAnnotation(a.id)
      });
    }, this);

    return markers;
  },

  render: function () {
    this.$el.html(_.tpl('comments', {
      markers: this.markers(),
    }));
    return this;
  }
});