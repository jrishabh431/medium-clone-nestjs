import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from '@app/tag/tag.entity';
import { CreateTagDto } from '@app/tag/dto/createTag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}
  async findAll(): Promise<TagEntity[]> {
    return await this.tagRepository.find();
  }

  async createTag(tagData: CreateTagDto): Promise<TagEntity> {
    const tagByName = await this.tagRepository.findOne({
      name: tagData.name,
    });
    if (tagByName) {
      throw new HttpException(
        'Tag already available',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newTag = new TagEntity();
    Object.assign(newTag, tagData);

    return await this.tagRepository.save(newTag);
  }
}
