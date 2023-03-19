import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import ComparisonButton from './ComparisonButton.vue';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('ComparisonButton.vue', () => {
  let actions;
  let store;

  beforeEach(() => {
    actions = {
      toggleCompareModal: jest.fn(),
    };
    store = new Vuex.Store({
      actions,
    });
  });

  it('dispatches "toggleCompareModal" when button is clicked', () => {
    const wrapper = shallowMount(ComparisonButton, { store, localVue });
    wrapper.find('button').trigger('click');
    expect(actions.toggleCompareModal).toHaveBeenCalled();
  });
});
