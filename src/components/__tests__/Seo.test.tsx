import React from 'react'
import { render } from '@testing-library/react'
import Seo from '../Seo'

jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: Array<React.ReactElement> }) => {
      return <div data-testid="next-head">{children}</div>;
    },
  };
});

describe('Seo', () => {
  it('renderiza o título corretamente', () => {
    const { getByTestId } = render(<Seo title="Test Title" description="Test Description" />)
    const head = getByTestId('next-head')
    const titleTag = head.querySelector('title')
    expect(titleTag).toBeTruthy()
    expect(titleTag?.textContent).toBe('Test Title')
  })

  it('inclui tags Open Graph', () => {
    const { getByTestId } = render(<Seo title="OG Test" description="OG Description" />)
    const head = getByTestId('next-head')
    const ogTitle = head.querySelector('meta[property="og:title"]')
    const ogDescription = head.querySelector('meta[property="og:description"]')
    expect(ogTitle).toBeTruthy()
    expect(ogDescription).toBeTruthy()
    expect(ogTitle?.getAttribute('content')).toBe('OG Test')
    expect(ogDescription?.getAttribute('content')).toBe('OG Description')
  })

  it('inclui tags Twitter Card', () => {
    const { getByTestId } = render(<Seo title="Twitter Test" description="Twitter Description" />);
    const head = getByTestId('next-head')
    const twitterTitle = head.querySelector('meta[name="twitter:title"]');
    const twitterDescription = head.querySelector('meta[name="twitter:description"]');
    
    expect(twitterTitle).toBeTruthy();
    expect(twitterDescription).toBeTruthy();
    expect(twitterTitle?.getAttribute('content')).toBe('Twitter Test');
    expect(twitterDescription?.getAttribute('content')).toBe('Twitter Description');
  })
})