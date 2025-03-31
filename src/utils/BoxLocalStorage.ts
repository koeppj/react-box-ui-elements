import { TokenStorage } from "box-typescript-sdk-gen/lib/box/tokenStorage.generated";
import { AccessToken } from 'box-typescript-sdk-gen/lib/schemas/accessToken.generated';
import { environment } from "../environment/environment";

export class BoxTokenStorageService  implements TokenStorage {

    store(token: AccessToken): Promise<undefined> {
      const keyName = environment.BoxTokenStorageKeyName;
      const keyNameForExpiresAt = `${keyName}_expiresAt`;
      localStorage.setItem(environment.BoxTokenStorageKeyName,JSON.stringify(token));
      localStorage.setItem(keyNameForExpiresAt, (Date.now() + (token.expiresIn ?? 0) * 1000).toString());
      return Promise.resolve(undefined);
    }
    get(): Promise<undefined | AccessToken> {
      let tokenStr = localStorage.getItem(environment.BoxTokenStorageKeyName);
      if (tokenStr) {
        return Promise.resolve(JSON.parse(tokenStr))
      }
      else {
        return Promise.resolve(undefined);
      }
    }
    clear(): Promise<undefined> {
      localStorage.removeItem(environment.BoxTokenStorageKeyName);
      return Promise.resolve(undefined);
    }
  
    tokenPresent(): Promise<boolean> {
      return Promise.resolve(localStorage.getItem(environment.BoxTokenStorageKeyName) !== null);
    }
  
    storageKeyName(): string {
      return environment.BoxTokenStorageKeyName
    }

    getExpiresAt(): number | undefined {
      const keyNameForExpiresAt = `${environment.BoxTokenStorageKeyName}_expiresAt`;
      const expiresAtStr = localStorage.getItem(keyNameForExpiresAt);
      if (expiresAtStr) {
        return parseInt(expiresAtStr);
      }
      else {
        return undefined;
      }
    }
  
  }