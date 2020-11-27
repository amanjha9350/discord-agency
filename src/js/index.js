import axios from 'axios';

class DiscordAdv {
  constructor() {
    this.timerID = null;
    this.reuiredError = '*Please enter a value';
    this.toggleMenu = this.toggleMenu.bind(this);
    this.loadContent = this.loadContent.bind(this);
    this.clickEventHandler = this.clickEventHandler.bind(this);
    this.toggleRegion = this.toggleRegion.bind(this);
    this.selectItems = this.selectItems.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  /*
   * toggleMenu: show/hide mobile header menu
   */
  toggleMenu() {
    const navEle = document.querySelector('.header-wrapper .navigation');

    if (navEle) {
      if (navEle.classList.contains('active')) {
        navEle.classList.remove('active');
        this.showOverlay(false);
      } else {
        navEle.classList.add('active');
        this.showOverlay(true);
      }
    }
  }

  showOverlay(show = false) {
    const overlayEle = document.querySelector('.overlay');
    if (overlayEle) {
      if (show) {
        overlayEle.classList.remove('hide');
        overlayEle.classList.add('show');
        document.body.classList.add('active-overlay');
      } else {
        overlayEle.classList.add('hide');
        overlayEle.classList.remove('show');
        document.body.classList.remove('active-overlay');
      }
    }
  }

  /*
   * loadForm: show form
   */
  showForm(show) {
    const overlayEle = document.querySelector('.overlay');
    const getInTouchForm = document.querySelector('.get-in-touch-form');
    if (overlayEle && getInTouchForm) {
      const formToShow = document.getElementById('getInTouchForm');
      const successfullState = document.querySelector('.js-successfull-state');
      if (formToShow.classList.contains('hide')) {
        formToShow.classList.remove('hide');
      }

      if (!successfullState.classList.contains('hide')) {
        successfullState.classList.add('hide');
      }

      if (show) {
        this.showOverlay(true);
        document.body.classList.add('active-form');
        getInTouchForm.classList.remove('hide');
        getInTouchForm.classList.add('show');
      } else {
        getInTouchForm.classList.add('hide');
        getInTouchForm.classList.remove('show');
        this.showOverlay(false);
        document.body.classList.remove('active-form');
        clearTimeout(this.timerID);
      }
    }
  }

  clickEventHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.target) {
      const showForm = e.target.dataset.showform === 'true';
      const hideMenu = e.target.dataset.showmenu === 'false';
      if (showForm) {
        this.showForm(true);
      } else {
        if (hideMenu) {
          this.toggleMenu();
        }
        this.showForm(false);
      }
    }
  }

  toggleRegion(e = null, arg = null) {
    e && e.stopPropagation();
    const loc = e ? e.target.dataset.loc : arg;
    const queryStr = `.select-${loc}`;
    document.querySelector(queryStr).classList.toggle('active');
    const querStr2 = `.select-${loc}-items`;
    document.querySelector(querStr2).classList.toggle('select-hide');
  }

  selectItems(e) {
    e.stopPropagation();
    const loc = e.target.dataset.loc;
    const queryStr = `.select-${loc}`;
    const selectedValue = e.target.dataset.value;
    document.querySelector(queryStr).innerHTML = e.target.innerText;
    const queryStr2 = `#select${loc} option`;
    const optionCollection = document.querySelectorAll(queryStr2);
    optionCollection.forEach((option) => {
      if (option.value === selectedValue) {
        option.selected = true;
      }
    })
    this.toggleRegion(null, loc);
  }

  radioBtnClickHandler(e) {
    const ele = e.target;
    if (ele.name === 'discordServer') {
      const inviteLinkEle = document.querySelector('.invite-link');
      if (ele.id === 'yes') {
        inviteLinkEle.classList.remove('hide');
        inviteLinkEle.classList.add('show');
        // hide error 
        const errorEle = document.querySelector('.error-invite-link');
        errorEle.classList.add('hide');
      } else {
        inviteLinkEle.classList.remove('show');
        inviteLinkEle.classList.add('hide');
      }
    }
  }

  resetForm() {
    const nameEle = document.getElementById('fullName');
    const emailIDEle = document.getElementById('emailId');
    const companyEle = document.getElementById('company');
    const regionEle = document.getElementById('selectregion');
    const regionCustomEle = document.querySelector('.select-selected.select-region');
    const discordServerEle = document.querySelector('input[name=discordServer]');
    const inviteLinkEle = document.querySelector('input[name=discordInviteLink]');
    const questionsEle = document.getElementById('selectregion');
    const questionCustomEle = document.querySelector('.select-selected.select-questions');;

    // reset all values
    nameEle.value = '';
    emailIDEle.value = '';
    companyEle.value = '';
    regionEle.selectedIndex = 0;
    regionCustomEle.innerText = regionEle.options[0].innerText;
    discordServerEle.value = '';
    inviteLinkEle.value = '';
    questionsEle.selectedIndex = 0;
    questionCustomEle.innerText = questionsEle.options[0].innerText;
  }

  closeLists(e) {
    e.stopPropagation();
    const regionList = document.querySelector('.select-selected.select-region');
    const regionListItems = document.querySelector('.select-items.select-region-items');
    const questionList = document.querySelector('.select-selected.select-questions');
    const questionListItems = document.querySelector('.select-items.select-questions-items');

    if (regionList && regionList.classList.contains('active')) {
      regionList.classList.remove('active');
      regionListItems.classList.add('select-hide');
    }

    if (questionList && questionList.classList.contains('active')) {
      questionList.classList.remove('active');
      questionListItems.classList.add('select-hide');
    }
  }

  submitHandler(e) {
    e.preventDefault();

    const name = document.getElementById('fullName').value;
    const emailID = document.getElementById('emailId').value;
    const company = document.getElementById('company').value;
    const region = document.getElementById('selectregion').selectedOptions[0].value;
    // const discordServer = document.querySelector('input[name=discordServer]:checked').value;
    const discordServerOptions = document.querySelectorAll('input[name=discordServer]');
    const discordServer = discordServerOptions[0].checked ? discordServerOptions[0].id : discordServerOptions[1].checked ? discordServerOptions[1].id : false;
    const inviteLink = document.querySelector('input[name=discordInviteLink]') ? document.querySelector('input[name=discordInviteLink]').value : '';
    const questions = document.getElementById('selectregion').selectedOptions[0].value;

    /* check error values start*/
    let errName = document.querySelector('.error-name');
    if (errName && name) {
      errName.innerText = '';
      errName.classList.add('hide');
    }

    let errEmailID = document.querySelector('.error-email');
    if (errEmailID && emailID) {
      errEmailID.innerText = '';
      errEmailID.classList.add('hide');
    }

    let errCompany = document.querySelector('.error-company');
    if (errCompany && company) {
      errCompany.innerText = '';
      errCompany.classList.add('hide');
    }
    let errRegion = document.querySelector('.error-region');
    if (errRegion && region) {
      errRegion.innerText = '';
      errRegion.classList.add('hide');
    }
    let errQuestions = document.querySelector('.error-questions');
    if (errQuestions && questions) {
      errQuestions.innerText = '';
      errQuestions.classList.add('hide');
    }

    if (discordServer && discordServer === 'yes') {
      // check for inviteLink error
      let errInviteLink = document.querySelector('.error-invite-link');
      if (errInviteLink) {
        errInviteLink.innerText = '';
        errQuestions.classList.add('hide');
      }
    }

    const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailID);
    // const validName = /^[A-Za-z]+$/.test(name);
    const validName = name && name.length > 0;
    const validInviteLink = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(inviteLink);
    /* check error values end */
    const checkForDiscordServer = discordServer ? ((discordServer === 'yes') ? inviteLink : (discordServer === 'no')) : false;
    if (name && emailID && company && region && checkForDiscordServer && questions && validEmail) {
      axios({
        method: 'post',
        // url: 'https://us-central1-pyamit-test.cloudfunctions.net/discord-advertiser-contact',
        url: 'https://us-central1-game-tv-prod.cloudfunctions.net/discord-advertiser-contact',
        data: {
          name: name,
          email: emailID,
          org: company,
          region: region,
          discordServer: discordServer,
          inviteLink: inviteLink,
          query: questions
        }
      }).then((resp) => {
        const formToBeHide = document.getElementById('getInTouchForm');
        const successfullState = document.querySelector('.js-successfull-state');

        formToBeHide.classList.add('hide');
        successfullState.classList.remove('hide');
        this.resetForm();
        this.timerID = setTimeout(() => {
          this.showForm(false);
        }, 3500);

      }).catch((err) => {
        this.resetForm();
        console.error(err.message);
      });
    } else {
      let errorEle = '';
      if (!name || !validName) {
        errorEle = document.querySelector('.error-name');
        errorEle.innerText = !name ? this.reuiredError : '*Please enter a valid name';
        errorEle.classList.remove('hide');
      }

      if (!emailID || !validEmail) {
        errorEle = document.querySelector('.error-email');
        const errorText = !emailID ? this.reuiredError : '*Please enter a valid email ID';
        errorEle.innerText = errorText;
        errorEle.classList.remove('hide');
      }

      if (!company) {
        errorEle = document.querySelector('.error-company');
        errorEle.innerText = this.reuiredError;
        errorEle.classList.remove('hide');
      }

      if (!region) {
        errorEle = document.querySelector('.error-region');
        errorEle.innerText = this.reuiredError;
        errorEle.classList.remove('hide');
      }

      if (!questions) {
        errorEle = document.querySelector('.error-questions');
        errorEle.innerText = this.reuiredError;
        errorEle.classList.remove('hide');
      }

      if (discordServer && discordServer === 'yes') {
        // check for inviteLink error
        errorEle = document.querySelector('.error-invite-link');
        if (!inviteLink || !validInviteLink) {
          errorEle.innerText = !inviteLink ? this.reuiredError : '*Please enter a valid link';
          errorEle.classList.remove('hide');
        }
      }
    }
  }


  /*
   * loadContent: EventHandler executes after dom content loads
   */
  loadContent() {
    const menus = document.querySelectorAll('.menu-icon');
    menus.forEach((menuIcon) => {
      menuIcon.addEventListener('click', this.toggleMenu);
    });
    //this.setHeaderActiveLink();

    const showFormBtns = document.querySelectorAll('.btn-get-in-touch');
    showFormBtns.forEach((btn) => {
      btn.addEventListener('click', this.clickEventHandler);
    });
    const overlayEle = document.querySelector('.overlay');
    overlayEle && overlayEle.addEventListener('click', this.clickEventHandler);

    const regionSelect = document.querySelector('.select-region');
    regionSelect && regionSelect.addEventListener('click', this.toggleRegion);

    const regionSelectItems = document.querySelector('.select-region-items');
    regionSelectItems && regionSelectItems.addEventListener('click', this.selectItems);

    const questionSelect = document.querySelector('.select-questions');
    questionSelect && questionSelect.addEventListener('click', this.toggleRegion);

    const questionSelectItems = document.querySelector('.select-questions-items');
    questionSelectItems && questionSelectItems.addEventListener('click', this.selectItems);

    const radioBtnWrapper = document.querySelector('.get-in-touch-form .radio-group');
    radioBtnWrapper && radioBtnWrapper.addEventListener('click', this.radioBtnClickHandler);

    const closeFormIcon = document.querySelector('.cross-icon');
    closeFormIcon && closeFormIcon.addEventListener('click', this.clickEventHandler);
    const gitForm = document.getElementById('getInTouchForm');
    gitForm && gitForm.addEventListener('submit', this.submitHandler);

    const formBody = document.querySelector('.get-in-touch-form');
    formBody.addEventListener('click', this.closeLists);
  }

  /*
   * init : entry point for current script
   */
  init() {
    document.addEventListener('DOMContentLoaded', this.loadContent);
  }
}

const discordIns = new DiscordAdv();
discordIns.init();