import { generateMagicLinkData, serializeMagicLink } from '../magiclinks.utils'
import { MagicLink } from '../magiclinks.entity'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

describe('generateMagicLinkData', () => {
  it('returns an object with a reportingToken matching UUID format', async () => {
    const result = await generateMagicLinkData()
    expect(result).toHaveProperty('reportingToken')
    expect(result.reportingToken).toMatch(UUID_REGEX)
  })

  it('returns a different token on each call', async () => {
    const first = await generateMagicLinkData()
    const second = await generateMagicLinkData()
    expect(first.reportingToken).not.toBe(second.reportingToken)
  })
})

describe('serializeMagicLink', () => {
  const baseLink: MagicLink = {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    reportingToken: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    companyId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    alias: 'Test Alias',
    createdById: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    createdBy: {
      id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      email: 'creator@example.com',
    } as any,
    company: {} as any,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
  }

  it('maps all fields correctly when createdBy user is present', () => {
    const result = serializeMagicLink(baseLink)
    expect(result.id).toBe(baseLink.id)
    expect(result.reportingToken).toBe(baseLink.reportingToken)
    expect(result.companyId).toBe(baseLink.companyId)
    expect(result.alias).toBe('Test Alias')
    expect(result.createdById).toBe(baseLink.createdById)
    expect(result.createdAt).toBe(baseLink.createdAt)
    expect(result.createdBy).toEqual({
      id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
      email: 'creator@example.com',
    })
  })

  it('sets createdBy to null when the relation is absent', () => {
    const linkWithoutCreatedBy: MagicLink = {
      ...baseLink,
      createdById: null,
      createdBy: null,
    }
    const result = serializeMagicLink(linkWithoutCreatedBy)
    expect(result.createdBy).toBeNull()
  })

  it('passes through alias correctly', () => {
    const withAlias = serializeMagicLink({ ...baseLink, alias: 'My Custom Alias' })
    expect(withAlias.alias).toBe('My Custom Alias')

    const withNullAlias = serializeMagicLink({ ...baseLink, alias: null })
    expect(withNullAlias.alias).toBeNull()
  })
})
