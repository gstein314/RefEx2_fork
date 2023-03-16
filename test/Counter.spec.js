import { render, screen, fireEvent } from '@testing-library/vue';
import Counter from '@/components/Counter.vue';

test('increments value on click', async () => {
  render(Counter);
  expect(screen.queryByText('Times clicked: 0')).toBeTruthy();

  const button = screen.getByText('increment');
  await fireEvent.click(button);
  await fireEvent.click(button);
  expect(screen.queryByText('Times clicked: 2')).toBeTruthy();
});
