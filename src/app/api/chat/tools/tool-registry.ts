// lib/tools/tool-registry.ts

import { getContact } from './getContact';
import { getResume } from './getResume';
import { getProjects } from './getProjects';
import { getSkills } from './getSkills';
import { getPresentation } from './getPresentation';
import { getSports } from './getSport';
import { getCrazy } from './getCrazy';
import { getInternship } from './getInternship';

export const toolRegistry = {
  getContact,
  getResume,
  getProjects,
  getSkills,
  getPresentation,
  getSports,
  getCrazy,
  getInternship,
};
