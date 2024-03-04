// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { Observable, throwError } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';

// @Injectable()
// export class TransformInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     // 컨트롤러 응답을 가로채고 수정합니다.
//     return next.handle().pipe(
//       map((data) => {
//         // 수정할 내용을 여기에 작성합니다.
//         return {
//           // 수정된 데이터를 반환합니다.
//           // 예: 모든 응답을 감싸는 표준 형식을 적용하는 등의 작업을 수행합니다.
//           data: data,
//           statusCode: context.switchToHttp().getResponse().statusCode, // 응답 상태 코드 가져오기
//           msg: 'ok', // 성공 메시지 추가
//         };
//       }),
//       catchError((error) => {
//         // 에러가 발생했을 때 에러를 가로채고 처리합니다.
//         return throwError(() => ({
//           msg: 'no',
//           statusCode: error.response.statusCode || 500, // 에러 상태 코드 가져오기
//         }));
//       }),
//     );
//   }
// }
