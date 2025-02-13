// @@@ pwned by 1m4unkn0wn @@@
import { SurveySubmission, SurveySubmissionResult } from "@prisma/client";
import { db } from "~/utils/db.server";

export type SurveySubmissionWithDetails = SurveySubmission & {
  results: SurveySubmissionResult[];
};
export async function getSurveySubmissions(surveyId: string): Promise<SurveySubmissionWithDetails[]> {
  return await db.surveySubmission.findMany({
    where: {
      surveyId,
    },
    include: {
      results: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteSurveySubmission(id: string) {
  return await db.surveySubmission.delete({
    where: { id },
  });
}
