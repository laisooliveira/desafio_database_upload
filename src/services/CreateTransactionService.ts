import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

import Transaction from '../models/Transaction';
interface Request {
  category: string
  title: string;
  type: 'income' | 'outcome';
  value: number;
}
class CreateTransactionService {
  public async execute({ category, title, type, value }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const categoryRepository = getRepository(Category);
    const { total } = await transactionRepository.getBalance();
    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance');
    }
    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category,
      }
    });
    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({ title: category });
      await categoryRepository.save(transactionCategory);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });
    await transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
