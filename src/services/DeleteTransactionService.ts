import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const transaction = await transactionRepository.findOne(id);
    if (!transaction) {
      throw new AppError('Transaction does not exist');
    }
    await transactionRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
