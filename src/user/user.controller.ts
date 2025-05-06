import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Res, Req, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Request, response, Response } from 'express';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService
  ) {}

  @Post('signup')
  async signup(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.userService.create({
      username,
      email,
      password: hashedPassword
    });
    const {password: _password, ...result} = user;
    
    return result;
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({passthrough: true} ) response: Response
  ) {
    const user = await this.userService.findOne({where: {email}});

    if (!user) throw new BadRequestException('Invalid credentials');
    
    if (!await bcrypt.compare(password, user.password)) throw new BadRequestException('Invalid credentials');

    const jwt = await this.jwtService.signAsync({id: user.id})

    response.cookie('jwt', jwt, {httpOnly: true});

    return {
      message: "success"
    };
  }

  @Get('user')
  async user(@Req() request: Request)  {
    try {
      const cookie = request.cookies['jwt'];
      if (!cookie) throw new UnauthorizedException('No token provided');

      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) throw new UnauthorizedException('Invalid token');

      const user = await this.userService.findOne({where: {id: data['id']}});

      if (!user) throw new UnauthorizedException('Invalid token');

      const {password, ...result} = user;
    
      return result;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('logout')
  async logout(@Res({passthrough: true}) response: Response) {
    response.clearCookie('jwt');

    return {
      message: "success"
    }

  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
