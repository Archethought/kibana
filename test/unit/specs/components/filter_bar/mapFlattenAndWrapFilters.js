define(function (require) {
  var _ = require('lodash');
  describe('Filter Bar Directive', function () {
    describe('mapFlattenAndWrapFilters()', function () {
      var sinon = require('test_utils/auto_release_sinon');
      var mapFlattenAndWrapFilters, $rootScope;
      beforeEach(module('kibana'));

      beforeEach(function () {
        module('kibana/courier', function ($provide) {
          $provide.service('courier', require('fixtures/mock_courier'));
        });
      });

      beforeEach(inject(function (Private, _$rootScope_) {
        mapFlattenAndWrapFilters = Private(require('components/filter_bar/lib/mapFlattenAndWrapFilters'));
        $rootScope = _$rootScope_;
      }));

      var filters = [
        null,
        [
          { meta: { index: 'logstash-*' }, exists: { field: '_type' } },
          { meta: { index: 'logstash-*' }, missing: { field: '_type' } }
        ],
        { meta: { index: 'logstash-*' }, query: { query_string: { query: 'foo:bar' } } },
        { meta: { index: 'logstash-*' }, range: { bytes: { lt: 2048, gt: 1024 } } },
        { meta: { index: 'logstash-*' }, query: { match: { _type: { query: 'apache', type: 'phrase' } } } }
      ];

      it('should map, flatten and wrap filters', function (done) {
        mapFlattenAndWrapFilters(filters).then(function (results) {
          expect(results).to.have.length(5);
          _.each(results, function (filter) {
            expect(filter).to.have.property('meta');
            expect(filter.meta).to.have.property('apply', true);
          });
          done();
        });
        $rootScope.$apply();
      });

    });
  });
});

