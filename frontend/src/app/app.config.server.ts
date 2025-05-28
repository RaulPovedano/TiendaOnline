import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { ProductService } from './services/product.service';
import { HttpClient } from '@angular/common/http';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    ProductService,
    HttpClient
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
