import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Details from './display-details';

const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    contact: '1234567890',
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane@example.com',
    contact: '9876543210',
  },
];

describe('Details component', () => {
  test('renders user details correctly', () => {
    render(<Details users={mockUsers} />);
    const nameColumn1 = screen.getByText('John Doe');
    const emailColumn1 = screen.getByText('john@example.com');
    const contactColumn1 = screen.getByText('1234567890');
    expect(nameColumn1).toBeInTheDocument();
    expect(emailColumn1).toBeInTheDocument();
    expect(contactColumn1).toBeInTheDocument();

    const nameColumn2 = screen.getByText('Jane Doe');
    const emailColumn2 = screen.getByText('jane@example.com');
    const contactColumn2 = screen.getByText('9876543210');
    expect(nameColumn2).toBeInTheDocument();
    expect(emailColumn2).toBeInTheDocument();
    expect(contactColumn2).toBeInTheDocument();
  });

  test('triggers edit and delete actions correctly', () => {
    const onEditMock = jest.fn();
    const onDeleteMock = jest.fn();
    render(<Details users={mockUsers} onEdit={onEditMock} onDelete={onDeleteMock} />);
    
    const editButton1 = screen.getAllByText('Edit')[0];
    const deleteButton1 = screen.getAllByText('Delete')[0];
    fireEvent.click(editButton1);
    fireEvent.click(deleteButton1);
    expect(onEditMock).toHaveBeenCalledWith(1);
    expect(onDeleteMock).toHaveBeenCalledWith(1);

    const editButton2 = screen.getAllByText('Edit')[1];
    const deleteButton2 = screen.getAllByText('Delete')[1];
    fireEvent.click(editButton2);
    fireEvent.click(deleteButton2);
    expect(onEditMock).toHaveBeenCalledWith(2);
    expect(onDeleteMock).toHaveBeenCalledWith(2);
  });

  test('renders loader when loading prop is true', () => {
    render(<Details users={null} loading={true} />);
    const loader = screen.getByRole('progressbar');
    expect(loader).toBeInTheDocument();
  });

  test('renders "No data available" when users prop is empty', () => {
    render(<Details users={[]} />);
    const noDataText = screen.getByText('No data available');
    expect(noDataText).toBeInTheDocument();
  });
});
