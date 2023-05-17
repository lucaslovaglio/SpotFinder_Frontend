 export enum Status {
    SUCCESS = "SUCCESS",
    ALERT = "ALERT",
    ERROR = "ERROR",
    UNDEFINED = "undefined",
  }
  
  export type alertProps = {
    action: () => void,
    type: Status,
    message: string,
    confirmation: boolean,
};