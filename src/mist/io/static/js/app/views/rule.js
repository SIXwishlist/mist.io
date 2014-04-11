define('app/views/rule', ['app/views/templated','ember'],
    //
    //  Rule View
    //
    //  @returns Class
    //
    function(TemplatedView) {

        'use strict'

        return TemplatedView.extend({


            didInsertElement: function() {
                this._super();
                info(this.rule.metric.name);
                Ember.run.next(this, function() {
                    $('#'+this.elementId).find('.ui-slider-track').hide();
                });
            },


            valueObserver: function() {
                $('#' + this.rule.id + ' .rule-value').val(this.rule.value);
                $('#' + this.rule.id + ' .rule-value').slider('refresh');
            }.observes('this.rule.value'),


            pendingActionObserver: function() {
                Ember.run.next(function() {
                    $('.delete-rule-container').trigger('create');
                });
            }.observes('this.rule.pendingAction'),


            //
            //
            //  Actions
            //
            //


            actions: {


                openMetricPopup: function() {
                    Mist.ruleEditController.open(this.rule, 'metric');
                },


                openOperatorPopup: function() {
                    Mist.ruleEditController.open(this.rule, 'operator');
                },


                openActionPopup: function() {
                    Mist.ruleEditController.open(this.rule, 'action');
                },


                deleteRuleClicked: function(){
                    this.rule.set('pendingAction', true);
                    var that = this;
                    Mist.ajax.DELETE('/rules/' + that.rule.id, {
                    }).success(function(){
                        info('Successfully deleted rule ', that.rule.id);
                        Mist.rulesController.removeObject(that.rule);
                        Mist.rulesController.redrawRules();
                        that.rule.set('pendingAction', false);
                    }).error(function(message) {
                        Mist.notificationController.notify('Error while deleting rule: ' + message);
                        that.rule.set('pendingAction', false);
                    });
                }
            }
        });
    }
);
