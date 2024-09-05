import assert from 'node:assert';
import { parse } from 'csv-parse';
import fs from 'fs';
import { stringify } from 'csv-stringify';

export class Database {
  #filePath
  #columnsFile = ['id', 'title', 'description', 'completed_at', 'created_at', 'updated_at']
  constructor (filePath) { 
    const fileExists = fs.existsSync(filePath);
    if(!fileExists) {
      try {
        const csvContent = this.#columnsFile.join(',') + '\n';
        fs.writeFile(filePath, csvContent, (err) => {
          if (err) {
            throw new Error('Erro ao escrever o arquivo CSV');
          } else {
            this.#filePath = filePath
          }
        })
      } catch (error) {
        throw new Error('File not found')
      }

    }
    this.#filePath = filePath
  }

  async create(task) {
    
    const writableStream = fs.createWriteStream(this.#filePath, { flags: 'a' });
    const stringifier = stringify({
      header: true, 
      columns: this.#columnsFile,
      append: true 
    });

    stringifier.pipe(writableStream);

    stringifier.write(task)
    stringifier.end();

    return new Promise((resolve, reject) => {
      writableStream.on('finish', resolve);
      writableStream.on('error', reject);
    });
  }

  async findAll() {

    const parser = fs.createReadStream(this.#filePath).pipe(parse({ delimiter: ',', columns: true }))

    const rows = [];
    for await (const row of parser) {
      rows.push(row);
    }
    return rows
  }

  async findById(id) {
    const all = await this.findAll()
    const task = all.find(task => task.id === id)
    return task
  }

  async update(id, task) {
    const rows = [];

    const parser = fs.createReadStream(this.#filePath).pipe(parse({ columns: true }));
  
    for await (const row of parser) {
      if (row.id === id) {
        const updatedRow = { ...row, ...task };
        rows.push(updatedRow);
      } else {
        rows.push(row);
      }
    }
  
    const writableStream = fs.createWriteStream(this.#filePath);
    const stringifier = stringify({
      header: true, 
      columns: Object.keys(rows[0])
    });
  
    stringifier.pipe(writableStream);
    rows.forEach(row => stringifier.write(row));
    stringifier.end();
  
    return new Promise((resolve, reject) => {
      writableStream.on('finish', resolve);
      writableStream.on('error', reject);
    });
  }
  async remove(id) {
    const rows = [];
    const parser = fs.createReadStream(this.#filePath).pipe(parse({ columns: true }));
    for await (const row of parser) {
      if (row.id !== id) {
        rows.push(row);
      } 
    }
  
    const writableStream = fs.createWriteStream(this.#filePath);
    const stringifier = stringify({
      header: true,
      columns: Object.keys(rows[0])
    });
  
    stringifier.pipe(writableStream);
    rows.forEach(row => stringifier.write(row));
    stringifier.end();
  
    return new Promise((resolve, reject) => {
      writableStream.on('finish', resolve);
      writableStream.on('error', reject);
    });
  }


}