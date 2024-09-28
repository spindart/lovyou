import React from 'react'
import { render } from '@testing-library/react'
import Seo from '../Seo'

let headTags: React.ReactElement[] = []

jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: Array<React.ReactElement> }) => {
      return <>{children}</>;
    },
  };
});

describe('Seo', () => {
  beforeEach(() => {
    headTags = []
  })

  it('renderiza o título corretamente', () => {
    render(<Seo title="Test Title" description="Test Description" />)
    const titleTag = headTags.find(tag => tag.type === 'title')
    expect(titleTag).toBeTruthy()
    expect(titleTag?.props.children).toBe('Test Title')
  })

  it('inclui tags Open Graph', () => {
    render(<Seo title="OG Test" description="OG Description" />)

    const ogTitle = headTags.find(tag => tag.props.property === 'og:title')
    const ogDescription = headTags.find(tag => tag.props.property === 'og:description')
    expect(ogTitle).toBeTruthy()
    expect(ogDescription).toBeTruthy()
    expect(ogTitle?.props.content).toBe('OG Test')
    expect(ogDescription?.props.content).toBe('OG Description')
  })

  it('inclui tags Twitter Card', () => {
    const { container } = render(<Seo title="Twitter Test" description="Twitter Description" />);

    const twitterTitle = container.querySelector('meta[name="twitter:title"]');
    const twitterDescription = container.querySelector('meta[name="twitter:description"]');
    
    expect(twitterTitle).toBeTruthy();
    expect(twitterDescription).toBeTruthy();
    expect(twitterTitle?.getAttribute('content')).toBe('Twitter Test');
    expect(twitterDescription?.getAttribute('content')).toBe('Twitter Description');
  })
})