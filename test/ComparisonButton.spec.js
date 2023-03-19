import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import ComparisonButton from '@/components/ComparisonButton.vue';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('ComparisonButton.vue', () => {
  let actions;
  let store;

  beforeEach(() => {
    actions = {
      set_compare_modal: jest.fn(),
    };
    store = new Vuex.Store({
      mutations: actions,
    });
  });

  it('dispatches "set_compare_modal" when button is clicked', () => {
    const wrapper = shallowMount(ComparisonButton, { store, localVue });
    wrapper.find('button').trigger('click');
    expect(actions.set_compare_modal).toHaveBeenCalled();
  });
});
