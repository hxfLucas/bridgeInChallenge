export type MagicLinkDTO = {
  id: string;
  reportingToken: string;
  createdAt: Date;
  companyId?: string | null;
};

export default MagicLinkDTO;
