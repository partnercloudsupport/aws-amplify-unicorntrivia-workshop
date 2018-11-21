# Unicorn Trivia - React Native Mobile Client

## Troubleshooting Notes


1) if android sdk isnt installing. click file → invalidate cache and restart

## Step 0: Configuring your computer

Before doing this workshop, please install these required programs for the platform you will be running.

### IOS

1. Download and install Xcode from the [AppStore](http://appstore.com/mac/apple/xcode)
2. Download and install OBS from [obsproject.com](https://obsproject.com/download)

### Android

1. Install Node and Watchman using [Homebrew](http://brew.sh/)
2. Install Intel x86 Atom_64 System Image from the Android Studio SDK menu

Install Node and Watchman using Homebrew using the below commands:

1. brew install node
2. brew install watchman

Install the AWS amplify CLI with the node package manager(npm) using the following command:

1. npm install -g @aws-amplify/cli

## Step 1:  Android Studio Configuration

1. clone the project with git clone 
2. run `export JAVA_HOME='/usr/libexec/java_home -v 1.8'` to get the right JDK version
3. Navigate to the root directory of the project
4. Run`npm install` to install dependencies detailed in package.json
5. Run `react-native link` to link the React Native modules libraries to the project.

## Step 2: Building the Video Component

Now that our environment is all set up we are ready to begin implementing our application! React applications are broken up into “Components” or microservices within the application. Let's begin by creating the video player component! This component will display our stream output on the phone.

1. Navigate to ./src/components/App/Video/Component.js
2. First, we need to write the function definitions for setVideoDimensions() and the Render() function.
3.  Lets now take a look at the setVideoDimensions() function. Lets paste this code snippet into the function. Here we set the values for the Hight and Width of the player which will be visible on the screen in our react application.
```
this.setState({
        styles: {
            ...this.state.styles,
            height: this.state.dimensions.scale * this.state.dimensions.width,
            width: this.state.dimensions.scale * this.state.dimensions.height
        }
    });
```
5. The final step is to define the render function. This is the code that will draw our component on the screen. In this case the render function will place our video player over the entire area of the screen! Paste in this code into the render function. **REMEMBER TO REPLACE THE SOURCE URI WITH YOUR MEDIASTORE EGRESS URL!**
```         return(
                <ReactNativeVideoPlayer
                    source={{uri: "INSERT_MEDIAPACKAGE_URL"}}
                    ref={(ref) => {
                        this.player = ref
                    }}
                    resizeMode={"stretch"}
                    muted={true}
                    style={{
                        minWidth: Dimensions.get('window').width + 200,
                        minHeight: Dimensions.get('window').height,
                        left: -100
                    }}
                />
            );
```
## Step 3: Subscribing to the GraphQL API back end

1. Creating/migrating the aws_exports file and also the API.js files
1. Navigate to ./src/components/App/Game/component.js
1. Now we are ready to implement our graphql subscriptions. We will be creating two listeners, one listening for new questions and one listening for updated questions.
1. Find the function named “listenForQuestions” and paste in the following code.
```
let self = this;
        API.graphql(
            graphqlOperation(gqlToString(OnCreateQuestion))
        ).subscribe({
            next: (data) => {
                self.setState({
                    question: data.value.data,
                    answerAvailable: false,
                    questionAvailable: true,
                    modalVisible: true
                });
        }
     })
```
Explain what the code does. So we do a subscribe to the mutation called onCreateQuestion then do something with state.

1. Find the function named “listenForAnswers” and paste in the following code.
```
let self = this;
    API.graphql(
        graphqlOperation(gqlToString(OnUpdateQuestion))
    ).subscribe({
        next: (data) => {
            setTimeout(() => {
                self.setState({
                    answer: data.value.data,
                    answerAvailable: true,
                    questionAvailable: false,
                    modalVisible: true
                });
            }, 1000);
        }
    })
 ```
3. We are now successfully subscribed to our GraphQL backend and our application is listening for new questions and questions being answered!

## Step 4: Populating the question/answer modal

Now that our stream is playing and our subscriptions are set up. The last thing to do is to create the modal which displays the question and choices when a messaged, housing a new question or answer, is received by our listeners.

1.  The first step is to create the view for when a new question is pushed. Paste the following function into in the game component below the large commented code block.

```
    question = () => {
        if(this.state.questionAvailable){
            setTimeout((() => {
                this.setState({
                    modalVisible: false,
                    questionAvailable: false,
                    buttonsDisabled: true,
                    selectedAnswerButton: null
                });
            }).bind(this), 10000);
            return(
                <View style={styles.questionContainer}>
                    <View style={styles.question}>
                        <View style={styles.questionTitleContainer}>
                            <Text style={styles.questionTitle}>{ this.state.question.onCreateQuestion.question }</Text>
                        </View>
                        <View style={styles.answerButtonContainer}>
                            { this.answerButtons() }
                        </View>
                    </View>
                </View>
            );
        }
    }
```

   3. We will then create a similar view. This time for when an answered question is returned to the user displaying the correct and incorrect answer choices. Implement this view by pasting in the following code.

```
    answer = () => {
        let self = this;
        if(this.state.answerAvailable){
            setTimeout((()=> {
                let gameOver = this.state.questionCount == 1 ? true : false;
                let wrongQuestions = this.state.answerChosen.answer !== this.state.answer.onUpdateQuestion.answers[this.state.answer.onUpdateQuestion.answerId] ? [...this.state.wrongQuestions, {question: this.state.answer, answer: this.state.answerChosen.answer}] : [...this.state.wrongQuestions];
                if(gameOver){
                    setTimeout(() => {
                        self.setState({
                            modalVisible: true,
                            modalBackground: "transparent"
                        }, () => {
                            console.log("final state: ", self.state);
                        })
                    }, 2000);
                }
                this.setState({
                    modalVisible: false,
                    answerAvailable: false,
                    buttonsDisabled: false,
                    wrongQuestions: wrongQuestions,
                    answerChosen: {},
                    selectedAnswerButton: null,
                    gameOver: gameOver,
                    winner: gameOver == true && wrongQuestions.length == 0 ? true : false,
                    loser: gameOver == true && wrongQuestions.length > 0 ? true : false
                });
            }).bind(this), 10000);
            return(
                <View style={styles.questionContainer}>
                    <View style={styles.question}>
                        <View style={styles.questionTitleContainer}>
                            <Text style={styles.questionTitle}>{ this.state.answer.onUpdateQuestion.question }</Text>
                        </View>
                        <View style={styles.answerButtonContainer}>
                            { this.answerButtons() }
                        </View>
                    </View>
                </View>
            );
        }
    }
```

   4. The last function we need to include is the function that changes our data model when an answer is chosen. Lets call this function answerChosen. Paste next to the other functions we defined previously.

```
    answerChosen = (index) => {
        this.setState({
            questionsAnswered: true,
            selectedAnswerButton: index,
            buttonsDisabled: true,
            answerChosen: {
                index: index,
                answer: this.state.question.onCreateQuestion.answers[index]
            },
            questionCount: this.state.questionCount + 1
        });
    }
```

**5. The last thing to do is define how all the components are laid out on the screen, as well as define the logic of what happens on button clicks. In order to do this, uncomment the large code block for our answerButtons function.**
^^^^^^ **NEEDS TO CHANGE**

## Step 5: Running the application!

Now that we have every section of the application implemented, it's time to run the app in our emulator.

1. First we want to open up the root path of our project in Android Studio.
1. The next step is to create and launch an Android emulator. We will start by clicking the purple phone icon in the menu bar.
![AndroidLaunchEmu](assets/android_studio_launch_emu.png)
1. Next we will chose the create virtual device button
![AndroidLaunchEmu](assets/android_studio_create_device.png)
1. We need to choose a device compatible with older versions of the API. Lets choose a Nexus 5X device! Then select Next.
![AndroidLaunchEmu](assets/android_studio_choose_device.png)
1. Finally we need the android API Level 27 system image. This should be Android Oreo. If you don't already have it installed go ahead and begin the download (remember to check your drive for available space as these downloads can be fairly large)
1. Now select next and finish to return back to the previous screen. You should see your newely created virtual device. From here choose the green 'Play' button to launch the emulator!
![AndroidLaunchEmu](assets/android_studio_play_device.png)
1. Wait for android to launch and the home screen to appear. Then return to the terminal and navigate back to the root directory of our application.
1. From here run the command `react-native run-android` to launch the application in the emulator

Congratulations! You have now successfully implemented a UnicornTrivia application on one of three suported platforms!

Below are some additional resources for further development! Feel free to skip on forward to the clean up section ![here](https://github.com/awslabs/aws-amplify-unicorntrivia-workshop#wrap-up)!












