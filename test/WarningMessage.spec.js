import { mount } from '@vue/test-utils';
import WarningMessage from '@/components/WarningMessage.vue';

describe('Does WarningMessage render a span?', () => {
  it('renders a span', () => {
    const wrapper = mount(WarningMessage);
    const span = wrapper.findComponent('span');
    expect(span.exists()).toBe(true);
  });
});
