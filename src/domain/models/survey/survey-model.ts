import { SurveyAnswerModel } from '@/domain/models/survey/survey-answer-model'

export type SurveyModel = {
  id: string
  question: string
  answers: SurveyAnswerModel[]
  date: Date
  didAnswer: boolean
}
