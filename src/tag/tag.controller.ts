import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TagService } from '@app/tag/tag.service';
import { CreateTagDto } from '@app/tag/dto/createTag.dto';
import { TagEntity } from '@app/tag/tag.entity';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { BackendValidationPipe } from '@app/shared/pipes/backendValidation.pipe';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  // @UsePipes(new ValidationPipe())
  /* this is the default nestjs validation provider and returns error message in it's own way,
   we do not have control over error message formatting  here */
   @UsePipes(new BackendValidationPipe())
   /* With this we have implemented our owne Validation pipe with custom error message */
  @UseGuards(AuthGuard)
  async createTag(@Body('tag') tagData: CreateTagDto): Promise<TagEntity> {
    return await this.tagService.createTag(tagData);
  }

  @Get()
  async findAll(): Promise<{ tags: string[] }> {
    const tags = await this.tagService.findAll();
    return {
      tags: tags.map((tag) => tag.name),
    };
  }
}
