import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Contact from './contact';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe('Contact component', () => {
  test('opens dialog when "Add details" button is clicked', () => {
    render(<Contact />);
    const addButton = screen.getByText('Add details');
    fireEvent.click(addButton);
    const dialogTitle = screen.getByText('Add User');
    expect(dialogTitle).toBeInTheDocument();
  });

  test('displays validation error when trying to save without entering details', async () => {
    render(<Contact />);
    const addButton = screen.getByText('Add details');
    fireEvent.click(addButton);
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    await waitFor(() => {
      const nameError = screen.getByText('Please enter a name');
      const emailError = screen.getByText('Please enter an email');
      const contactError = screen.getByText('Please enter a contact number');
      expect(nameError).toBeInTheDocument();
    });
  });
})