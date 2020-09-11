import { BadRequestException, PipeTransform } from '@nestjs/common';

export class EmailValidationPipe implements PipeTransform{

  transform(value: string): any {

    if (!this.isValid(value)){
      throw new BadRequestException(`email ${value}is not of opennetworking domain`);
    }

    return value
  }

  private isValid (email: string){

    const validArr = email.split('@');

    if(validArr[1].localeCompare('opennetworking.org') === 0){
      return true;
    }
  }
}