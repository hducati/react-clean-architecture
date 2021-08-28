import { makeApiUrl } from '@/main/factories/http/api-url-factory'
import { LoadSurveyResult } from '@/domain/usecases'
import { makeAuthorizeHttpGetClientDecorator } from '@/main/factories/decorators'
import { RemoteLoadSurveyResult } from '@/data/usecases'

export const makeRemoteLoadSurveyResult = (id: string): LoadSurveyResult => {
  return new RemoteLoadSurveyResult(makeApiUrl(`/surveys/${id}/results`), makeAuthorizeHttpGetClientDecorator())
}
