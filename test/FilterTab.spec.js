import {
  render,
  screen,
  fireEvent,
  getByPlaceholderText,
} from '@testing-library/vue';
import ScreenerView from '@/components/ScreenerView/ScreenerView.vue';
import WarningMessage from '@/components/WarningMessage.vue';

test('Reset search conditions', async () => {
  // const { getByLabelText, getByText } = render(ScreenerView);
  render(WarningMessage);
  // const resetAllButton = screen.getByText('Reset all');
  // await fireEvent.click(resetAllButton);
  // const mainInputField = getByPlaceholderText('transcription factor');
  // expect(mainInputField._value).toBe('');
  // expect(screen.queryByText('Times clicked: 2')).toBeTruthy();
  // expect(screen.queryByText('Times clicked: 0')).toBeTruthy();
  // await fireEvent.click(button);
});
