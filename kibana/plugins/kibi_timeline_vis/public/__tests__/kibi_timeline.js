import SearchSourceProvider from 'fixtures/stubbed_search_source';
import TimelineHelper from '../lib/helpers/timeline_helper';
import sinon from 'auto-release-sinon';
import angular from 'angular';
import expect from 'expect.js';
import _ from 'lodash';
import ngMock from 'ng_mock';
import moment from 'moment';
import 'plugins/kibi_timeline_vis/kibi_timeline_vis_controller';

require('plugins/kibi_timeline_vis/kibi_timeline_vis_controller');

describe('KibiTimeline Directive', function () {
  let $elem;
  let $rootScope;
  let $scope;
  let searchSource;
  let highlightTags;
  let queryFilter;
  let indexPatterns;

  let getSortOnFieldObjectSpy;

  const init = function ($elem, props) {
    ngMock.inject(function (_$rootScope_, $compile, Private, _indexPatterns_) {
      $rootScope = _$rootScope_;
      $compile($elem)($rootScope);
      $elem.scope().$digest();
      $scope = $elem.isolateScope();
      _.assign($scope, props);
      $scope.$digest();
      queryFilter = Private(require('ui/filter_bar/query_filter'));
      indexPatterns = _indexPatterns_;
    });
  };

  const destroy = function () {
    $scope.$destroy();
    $rootScope.$destroy();
    $elem.remove();
  };

  function initTimeline({ invertFirstLabelInstance = false, useHighlight = false, withFieldSequence, endField, startField, labelField }) {
    ngMock.module('kibana', $provide => {
      $provide.constant('kbnDefaultAppId', '');
      $provide.constant('kibiDefaultDashboardTitle', '');
      $provide.constant('elasticsearchPlugins', ['siren-join']);
    });
    const directive = `<kibi-timeline
                        vis-options="visOptions"
                        timeline-options="timelineOptions">
                      </kibi-timeline>`;
    $elem = angular.element(directive);
    // this is so the elements gets correctly properties like offsetWidth
    // plus the timeline is actually visible when tests are run in dev mode
    $elem.appendTo('body');

    ngMock.inject(function (_highlightTags_, Private) {
      const TimelineHelper = Private(require('../lib/helpers/timeline_helper'));
      getSortOnFieldObjectSpy = sinon.spy(TimelineHelper, 'getSortOnFieldObject');

      highlightTags = _highlightTags_;

      searchSource = Private(SearchSourceProvider);
      searchSource.highlight = sinon.stub();
      searchSource.sort = sinon.stub();
    });

    const params = { invertFirstLabelInstance, useHighlight, endField, labelField, startField };
    if (withFieldSequence) {
      params.startFieldSequence = startField.split('.');
      params.endFieldSequence = endField.split('.');
      params.labelFieldSequence = labelField.split('.');
    }

    init($elem, {
      visOptions: {
        groups: [
          {
            id: 1,
            color: '#ff0000',
            label: 'logs',
            params,
            searchSource
          }
        ],
        groupsOnSeparateLevels: false,
        selectValue: 'id',
        notifyDataErrors: false
      }
    });
    $scope.$digest();
  }

  afterEach(function () {
    destroy();
  });

  it('should compile', function () {
    initTimeline({});
    expect($elem.text()).to.not.be.empty();
  });

  it('should correctly return a timeline', function () {
    initTimeline({
      startField: '@timestamp',
      endField: '',
      labelField: 'machine.os'
    });

    const date = '25-01-1995';
    const dateObj = moment(date, 'DD-MM-YYYY');
    const results = {
      took: 73,
      timed_out: false,
      _shards: {
        total: 144,
        successful: 144,
        failed: 0
      },
      hits: {
        total : 49487,
        max_score : 1.0,
        hits: [
          {
            _index: 'logstash-2014.09.09',
            _type: 'apache',
            _id: '61',
            _score: 1,
            _source: {
              '@timestamp': date,
              machine: {
                os: 'linux'
              }
            },
            fields: {
              '@timestamp': [ dateObj ]
            }
          }
        ]
      }
    };
    searchSource.crankResults(results);
    $scope.$digest();
    expect($scope.timeline.itemsData.length).to.be(1);
    $scope.timeline.itemsData.forEach(data => {
      sinon.assert.notCalled(searchSource.highlight);
      expect(data.value).to.be('linux');
      expect(data.start.valueOf()).to.be(dateObj.valueOf());
    });
  });

  it('should return an event with the all the labels joined', function () {
    initTimeline({
      startField: '@timestamp',
      endField: '',
      labelField: 'machine.os'
    });

    const date = '25-01-2015';
    const dateObj = moment(date, 'DD-MM-YYYY');
    const results = {
      took: 73,
      timed_out: false,
      _shards: {
        total: 144,
        successful: 144,
        failed: 0
      },
      hits: {
        total : 49487,
        max_score : 1.0,
        hits: [
          {
            _index: 'logstash-2014.09.09',
            _type: 'apache',
            _id: '61',
            _score: 1,
            _source: {
              '@timestamp': date,
              machine: {
                os: [ 'linux', 'mac' ]
              }
            },
            fields: {
              '@timestamp': [ dateObj ],
            }
          }
        ]
      }
    };
    searchSource.crankResults(results);
    $scope.$digest();
    expect($scope.timeline.itemsData.length).to.be(1);
    $scope.timeline.itemsData.forEach(data => {
      sinon.assert.notCalled(searchSource.highlight);
      expect(data.value).to.be('linux, mac');
      expect(data.start.valueOf()).to.be(dateObj.valueOf());
    });
  });

  it('should return an event for each start/end pairs', function () {
    initTimeline({
      startField: '@timestamp',
      endField: '',
      labelField: 'machine.os'
    });

    const dates = [ '25-01-2015', '16-12-2016' ];
    const dateObjs = _.map(dates, date => moment(date, 'DD-MM-YYYY'));
    const results = {
      took: 73,
      timed_out: false,
      _shards: {
        total: 144,
        successful: 144,
        failed: 0
      },
      hits: {
        total : 49487,
        max_score : 1.0,
        hits: [
          {
            _index: 'logstash-2014.09.09',
            _type: 'apache',
            _id: '61',
            _score: 1,
            _source: {
              '@timestamp': dates,
              machine: {
                os: 'linux'
              }
            },
            fields: {
              '@timestamp': dateObjs,
            }
          }
        ]
      }
    };
    searchSource.crankResults(results);
    $scope.$digest();
    expect($scope.timeline.itemsData.length).to.be(2);
    let i = 0;
    $scope.timeline.itemsData.forEach(data => {
      sinon.assert.notCalled(searchSource.highlight);
      expect(data.value).to.be('linux');
      expect(data.start.valueOf()).to.be(dateObjs[i].valueOf());
      i++;
    });
  });

  it('should get the highlighted terms of events if useHighlight is true', function () {
    initTimeline({
      useHighlight: true,
      startField: '@timestamp',
      endField: '',
      labelField: 'machine.os'
    });

    const date = '25-01-1995';
    const dateObj = moment(date, 'DD-MM-YYYY');
    const results = {
      took: 73,
      timed_out: false,
      _shards: {
        total: 144,
        successful: 144,
        failed: 0
      },
      hits: {
        total : 49487,
        max_score : 1.0,
        hits: [
          {
            _index: 'logstash-2014.09.09',
            _type: 'apache',
            _id: '61',
            _score: 1,
            _source: {
              '@timestamp': date,
              machine: {
                os: 'linux'
              }
            },
            fields: {
              '@timestamp': [ dateObj ]
            },
            highlight: {
              'machine.os': [
                `${highlightTags.pre}BEST BEST${highlightTags.post}`
              ]
            }
          }
        ]
      }
    };
    searchSource.crankResults(results);
    $scope.$digest();
    expect($scope.timeline.itemsData.length).to.be(1);
    sinon.assert.called(searchSource.highlight);
    $scope.timeline.itemsData.forEach(data => {
      expect(data.content).to.match(/best best/);
      expect(data.value).to.be('linux');
      expect(data.start.valueOf()).to.be(dateObj.valueOf());
    });
  });

  it('should sort on the start field if invertFirstLabelInstance', function () {
    initTimeline({
      invertFirstLabelInstance: true,
      startField: '@timestamp',
      endField: '',
      labelField: 'machine.os'
    });

    const date1 = '25-01-1995';
    const date1Obj = moment(date1, 'DD-MM-YYYY');
    const date2 = '26-01-1995';
    const date2Obj = moment(date2, 'DD-MM-YYYY');
    const date3 = '27-01-1995';
    const date3Obj = moment(date3, 'DD-MM-YYYY');

    const results = {
      took: 73,
      timed_out: false,
      _shards: {
        total: 144,
        successful: 144,
        failed: 0
      },
      hits: {
        total : 49487,
        max_score : 1.0,
        hits: [
          {
            _index: 'logstash-2014.09.09',
            _type: 'apache',
            _id: '61',
            _score: 1,
            _source: {
              '@timestamp': date1,
              machine: {
                os: 'linux'
              }
            },
            fields: {
              '@timestamp': [ date1Obj ]
            }
          },
          {
            _index: 'logstash-2014.09.09',
            _type: 'apache',
            _id: '62',
            _score: 1,
            _source: {
              '@timestamp': date2,
              machine: {
                os: 'mac'
              }
            },
            fields: {
              '@timestamp': [ date2Obj ]
            }
          },
          {
            _index: 'logstash-2014.09.09',
            _type: 'apache',
            _id: '63',
            _score: 1,
            _source: {
              '@timestamp': date3,
              machine: {
                os: 'linux'
              }
            },
            fields: {
              '@timestamp': [ date3Obj ]
            }
          }
        ]
      }
    };
    searchSource.crankResults(results);
    $scope.$digest();
    expect($scope.timeline.itemsData.length).to.be(3);
    sinon.assert.called(getSortOnFieldObjectSpy);
    sinon.assert.called(searchSource.sort);

    let itemIndex = 0;
    $scope.timeline.itemsData.forEach(data => {
      switch (itemIndex) {
        case 0:
          expect(data.value).to.be('linux');
          expect(data.start.valueOf()).to.be(date1Obj.valueOf());
          // emphasized, border style is solid
          expect(data.style).to.match(/color: #ff0000/);
          expect(data.style).to.match(/border-style: solid/);
          break;
        case 1:
          expect(data.value).to.be('mac');
          expect(data.start.valueOf()).to.be(date2Obj.valueOf());
          // emphasized, border style is solid
          expect(data.style).to.match(/color: #ff0000/);
          expect(data.style).to.match(/border-style: solid/);
          break;
        case 2:
          expect(data.value).to.be('linux');
          expect(data.start.valueOf()).to.be(date3Obj.valueOf());
          // border style is none
          expect(data.style).to.match(/color: #ff0000/);
          expect(data.style).to.match(/border-style: none/);
          break;
        default:
          expect().fail(`Should not have the case itemIndex=${itemIndex}`);
      }
      itemIndex++;
    });
  });

  describe('Missing data', function () {

    it('should support documents with missing label', function () {
      initTimeline({
        startField: '@timestamp',
        endField: '',
        labelField: 'machine.os'
      });

      const date = '25-01-1995';
      const dateObj = moment(date, 'DD-MM-YYYY');
      const results = {
        took: 73,
        timed_out: false,
        _shards: {
          total: 144,
          successful: 144,
          failed: 0
        },
        hits: {
          total : 49487,
          max_score : 1.0,
          hits: [
            {
              _index: 'logstash-2014.09.09',
              _type: 'apache',
              _id: '61',
              _score: 1,
              _source: {
                '@timestamp': date
              },
              fields: {
                '@timestamp': [ dateObj ]
              }
            }
          ]
        }
      };
      searchSource.crankResults(results);
      $scope.$digest();
      expect($scope.timeline.itemsData.length).to.be(1);
      $scope.timeline.itemsData.forEach(data => {
        sinon.assert.notCalled(searchSource.highlight);
        expect(data.value).to.be('N/A');
        expect(data.start.valueOf()).to.be(dateObj.valueOf());
      });
    });

    [
      {
        withFieldSequence: true
      },
      {
        withFieldSequence: false
      }
    ].forEach(({ withFieldSequence }) => {
      it(`should support documents with missing start date with ${withFieldSequence ? 'kibi' : 'kibana'}`, function () {
        initTimeline({
          withFieldSequence,
          startField: '@timestamp',
          endField: '',
          labelField: 'machine.os'
        });

        const results = {
          took: 73,
          timed_out: false,
          _shards: {
            total: 144,
            successful: 144,
            failed: 0
          },
          hits: {
            total : 49487,
            max_score : 1.0,
            hits: [
              {
                _index: 'logstash-2014.09.09',
                _type: 'apache',
                _id: '61',
                _score: 1,
                _source: {
                  '@timestamp': null,
                  machine: {
                    os: 'linux'
                  }
                },
                fields: {}
              }
            ]
          }
        };
        searchSource.crankResults(results);
        $scope.$digest();
        expect($scope.timeline.itemsData.length).to.be(0);
      });
    });
  });

  describe('Filter creation', function () {

    const simulateClickOnItem = function ($el) {
      const $panel = $el.find('.vis-panel.vis-center');
      const $item = $el.find('.vis-content .vis-itemset .vis-foreground .vis-group .vis-item .vis-item-content .kibi-tl-label-item');
      const event = new MouseEvent('click', {
        target: {
          // cheat that we clicked on the item
          'timeline-item': {}
        }
      });
      const eventData = {
        target: $item[0],
        srcEvent: event
      };
      // hammer comes from vis.js timeline library
      // cheat again and trigger the tap with fake eventData
      $panel[0].hammer[0].emit('tap', eventData);
    };
    const dateStart = '25-01-1995';
    const dateStartObj = moment(dateStart, 'DD-MM-YYYY');
    const dateEnd = '27-01-1995';
    const dateEndObj = moment(dateEnd, 'DD-MM-YYYY');
    const results = {
      took: 73,
      timed_out: false,
      _shards: {
        total: 144,
        successful: 144,
        failed: 0
      },
      hits: {
        total: 49487,
        max_score: 1.0,
        hits: [
          {
            _index: 'logstash-2014.09.09',
            _type: 'apache',
            _id: '61',
            _score: 1,
            _source: {
              '@timestamp': dateStart,
              'endDate': dateEnd,
              machine: {
                os: 'linux'
              }
            },
            fields: {
              '@timestamp': [dateStartObj],
              'endDate': [dateEndObj],
            }
          }
        ]
      }
    };

    it('correct filter should be created - (default) ID', function (done) {
      initTimeline({
        startField: '@timestamp',
        endField: '',
        labelField: 'machine.os'
      });
      const addFilterSpy = sinon.spy(queryFilter, 'addFilters');
      searchSource.crankResults(results);
      $scope.$digest();

      const expectedFilters = [{
        query: {
          ids: {
            type: 'apache',
            values: ['61']
          }
        },
        meta: {
          index: 'logstash-*'
        }
      }];

      // check on next tick
      setTimeout(function () {
        expect($scope.timeline.itemsData.length).to.be(1);
        simulateClickOnItem($elem);
        sinon.assert.calledOnce(addFilterSpy);
        sinon.assert.calledWith(addFilterSpy, expectedFilters);
        done();
      }, 0);
    });

    it('correct filter should be created - LABEL', function (done) {
      initTimeline({
        startField: '@timestamp',
        endField: '',
        labelField: 'machine.os'
      });
      $scope.visOptions.selectValue = 'label';
      const addFilterSpy = sinon.spy(queryFilter, 'addFilters');
      searchSource.crankResults(results);
      $scope.$digest();

      const expectedFilters = [{
        meta: {
          index: 'logstash-*'
        },
        query: {
          match: {
            'machine.os': {
              query: 'linux',
              type: 'phrase'
            }
          }
        }
      }];

      // check on next tick
      setTimeout(function () {
        expect($scope.timeline.itemsData.length).to.be(1);
        simulateClickOnItem($elem);
        sinon.assert.calledOnce(addFilterSpy);
        sinon.assert.calledWith(addFilterSpy, expectedFilters);
        done();
      }, 0);
    });

    it('correct filter should be created - DATE', function (done) {
      initTimeline({
        startField: '@timestamp',
        endField: '',
        labelField: 'machine.os'
      });
      $scope.visOptions.selectValue = 'date';
      const addFilterSpy = sinon.spy(queryFilter, 'addFilters');
      searchSource.crankResults(results);
      $scope.$digest();

      const expectedFilters = [{
        meta: {
          index: 'logstash-*'
        },
        query: {
          match: {
            '@timestamp': {
              query: Date.parse(dateStartObj),
              type: 'phrase'
            }
          }
        }
      }];

      // check on next tick
      setTimeout(function () {
        expect($scope.timeline.itemsData.length).to.be(1);
        simulateClickOnItem($elem);
        sinon.assert.calledOnce(addFilterSpy);
        sinon.assert.calledWith(addFilterSpy, expectedFilters);
        done();
      }, 0);
    });

    it('correct filter should be created - DATE RANGE', function (done) {
      initTimeline({
        startField: '@timestamp',
        endField: 'endDate',
        labelField: 'machine.os'
      });

      let filters;
      const addFilterSpy = sinon.stub(queryFilter, 'addFilters', function (f) {
        filters = f;
      });

      $scope.visOptions.selectValue = 'date';

      sinon.stub(indexPatterns, 'get').returns(Promise.resolve(
        {
          id: 'logstash-*',
          fields: [
            {name: '@timestamp'},
            {name: 'endDate'}
          ]
        }
      ));
      searchSource.crankResults(results);
      $scope.$digest();

      // check on next tick
      setTimeout(function () {
        expect($scope.timeline.itemsData.length).to.be(1);
        simulateClickOnItem($elem);
        // check on next tick
        setTimeout(function () {
          sinon.assert.calledOnce(addFilterSpy);

          // not using calledWith
          // as dates depends on browser timezones it is safer to check
          // individual properties
          const lowerBound = '' + filters[0].range['@timestamp'].gte;
          const lowerMeta = filters[0].meta;
          const higherBound = '' + filters[1].range.endDate.lte;
          const higherMeta = filters[1].meta;
          expect(lowerBound.indexOf('Wed Jan 25 1995')).to.equal(0);
          expect(lowerMeta.alias.indexOf('@timestamp >= Wed Jan 25 1995')).to.equal(0);
          expect(lowerMeta.index).to.equal('logstash-*');
          expect(higherBound.indexOf('Fri Jan 27 1995')).to.equal(0);
          expect(higherMeta.alias.indexOf('endDate <= Fri Jan 27 1995')).to.equal(0);
          expect(higherMeta.index).to.equal('logstash-*');
          done();
        }, 0);
      }, 0);
    });

  });

});

