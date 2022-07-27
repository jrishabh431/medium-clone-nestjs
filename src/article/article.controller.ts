import { AuthGuard } from '@app/user/guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { CreateArticleDto } from '@app/article/dto/createArticle.dto';
import { IArticleReponse } from '@app/article/types/articleResponse.interface';
import { DeleteResult } from 'typeorm';
import { IArticlesReponse } from '@app/article/types/articlesResponse.interface';
import { BackendValidationPipe } from '@app/shared/pipes/backendValidation.pipe';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<IArticlesReponse> {
    return this.articleService.findAll(currentUserId, query);
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  async getFeed(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<IArticlesReponse> {
    return this.articleService.getFeed(currentUserId, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  // @UsePipes(new ValidationPipe())
  /* this is the default nestjs validation provider and returns error message in it's own way,
   we do not have control over error message formatting  here */
  @UsePipes(new BackendValidationPipe())
  /* With this we have implemented our owne Validation pipe with custom error message */
  async create(
    @User() currentUser: UserEntity,
    @Body('article') createArticleData: CreateArticleDto,
  ): Promise<IArticleReponse> {
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleData,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    const article = await this.articleService.findBySlug(slug);
    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteBySlug(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<DeleteResult> {
    return await this.articleService.deleteBySlug(slug, currentUserId);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  // @UsePipes(new ValidationPipe())
  /* this is the default nestjs validation provider and returns error message in it's own way,
   we do not have control over error message formatting  here */
  @UsePipes(new BackendValidationPipe())
  /* With this we have implemented our owne Validation pipe with custom error message */
  async updateBySlug(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Body('article') updateArticleData: CreateArticleDto,
  ): Promise<IArticleReponse> {
    const article = await this.articleService.updateBySlug(
      slug,
      updateArticleData,
      currentUserId,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addArticleToFavorite(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<IArticleReponse> {
    const article = await this.articleService.addArticleToFavorite(
      slug,
      currentUserId,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async deleteArticleFromFavorite(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<IArticleReponse> {
    const article = await this.articleService.deleteArticleFromFavorite(
      slug,
      currentUserId,
    );
    return this.articleService.buildArticleResponse(article);
  }
}
