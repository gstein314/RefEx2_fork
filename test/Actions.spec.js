import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Actions from './Actions.vue';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('Actions.vue', () => {
  let actions;
  let store;

  beforeEach(() => {
    actions = {
      actionClick: jest.fn(),
    };
    store = new Vuex.Store({
      actions,
    });
  });

  it('calls store action "actionClick" when button is clicked', () => {
    const wrapper = shallowMount(Actions, { store, localVue });
    wrapper.find('button').trigger('click');
    expect(actions.actionClick).toHaveBeenCalled();
  });
});
