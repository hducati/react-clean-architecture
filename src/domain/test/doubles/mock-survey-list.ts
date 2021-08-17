import { SurveyModel } from '@/domain/models'
import faker from 'faker'

export const mockSurveyListModel = (): SurveyModel[] => ([{
  id: faker.datatype.uuid(),
  question: faker.random.words(10),
  answers: [
    {
      answer: faker.random.words(),
      image: faker.internet.url()
    },
    {
      answer: faker.random.words()
    }
  ],
  didAnswer: faker.datatype.boolean(),
  date: faker.date.recent()
}])
