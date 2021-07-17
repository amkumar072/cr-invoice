
export class AppConstants {
  // Generic
  static readonly CANCEL_MODAL = 'Cancel';
  static readonly CONFIRM_MODAL = 'Confirm';
  static readonly ADD = 'Add';
  static readonly SAVE = 'Save';
  static readonly UPDATE = 'Update';
  static readonly PROFILE = 'Profile';
  static readonly DETAIL = 'Detail';

  // Flyers
  static readonly INVOICE = 'Invoice';


  // css class
  static readonly MODAL_75_PERCENTAGE_SCREEN: string = 'modal-75-percentage-screen';
  static readonly MODAL_FULL_SCREEN: string = 'modal-fullscreen';
  static reload() {
    window.location.reload();
  }

}
