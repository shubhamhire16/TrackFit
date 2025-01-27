document.addEventListener('DOMContentLoaded', () => {
  let exercises = [];
  let totalWeightLifted = 0;
  let timer;
  let seconds = 0;
  let workoutInProgress = false;

  const routineButtons = document.querySelectorAll('#routine-selection button');
  routineButtons.forEach(button => {
      button.addEventListener('click', () => {
          const routineType = button.id.replace('-btn', '');
          loadExercises(routines[routineType]);
          document.getElementById('start-workout-btn').disabled = false;
      });
  });

  const routines = {
      legs: [
          { name: 'Squats' },
          { name: 'Lunges' },
          { name: 'Leg Press' },
          { name: 'Hamstring Curls' },
          { name: 'Calf Raises' },
          { name: 'Leg Extensions' }
      ],
      push: [
          { name: 'Bench Press' },
          { name: 'Overhead Press' },
          { name: 'Incline Press' },
          { name: 'Tricep Dips' },
          { name: 'Chest Flyes' },
          { name: 'Push-ups' }
      ],
      pull: [
          { name: 'Deadlifts' },
          { name: 'Pull-ups' },
          { name: 'Barbell Rows' },
          { name: 'Lat Pulldown' },
          { name: 'Face Pulls' },
          { name: 'Bicep Curls' }
      ]
  };

  // Load Exercises Dynamically
  function loadExercises(routine) {
      const exerciseList = document.getElementById('exercise-list');
      exerciseList.innerHTML = `
          <table>
              <thead>
                  <tr>
                      <th>Exercise</th>
                      <th>Sets</th>
                      <th>Reps</th>
                      <th>Weight (kg)</th>
                      <th>Total Weight (kg)</th>
                      <th>Complete</th>
                  </tr>
              </thead>
              <tbody>
                  ${routine.map(exercise => `
                      <tr>
                          <td>${exercise.name}</td>
                          <td><input type="number" class="sets-input" value="3" min="1" /></td>
                          <td><input type="number" class="reps-input" value="12" min="1" /></td>
                          <td><input type="number" class="weight-input" data-exercise="${exercise.name}" value="0" min="0" /></td>
                          <td class="total-weight-cell">0</td>
                          <td><input type="checkbox" class="set-complete" disabled /></td>
                      </tr>
                  `).join('')}
              </tbody>
          </table>
      `;

      // Add event listeners for weight, reps, and sets inputs
      document.querySelectorAll('.weight-input').forEach(input => {
          input.addEventListener('input', updateWeight);
      });

      document.querySelectorAll('.sets-input').forEach(input => {
          input.addEventListener('input', updateWeight);
      });

      document.querySelectorAll('.reps-input').forEach(input => {
          input.addEventListener('input', updateWeight);
      });
  }

  // Update weight lifted for each set
  function updateWeight(e) {
      const input = e.target;
      const row = input.closest('tr');
      const sets = parseInt(row.querySelector('.sets-input').value) || 0;
      const reps = parseInt(row.querySelector('.reps-input').value) || 0;
      const weight = parseFloat(row.querySelector('.weight-input').value) || 0;

      const totalWeightForExercise = sets * reps * weight;
      row.querySelector('.total-weight-cell').textContent = totalWeightForExercise;

      updateTotalWeight();
  }

  // Update total weight lifted
  function updateTotalWeight() {
      totalWeightLifted = 0;
      document.querySelectorAll('.total-weight-cell').forEach(cell => {
          totalWeightLifted += parseFloat(cell.textContent) || 0;
      });
      document.getElementById('total-weight-value').textContent = totalWeightLifted;
  }

  // Timer Functionality
  function startTimer() {
      if (workoutInProgress) return;
      workoutInProgress = true;
      timer = setInterval(() => {
          seconds++;
          const minutes = Math.floor(seconds / 60);
          const remainingSeconds = seconds % 60;
          document.getElementById('timer-value').textContent = `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
      }, 1000);
  }

  // Stop Timer
  function stopTimer() {
      clearInterval(timer);
      workoutInProgress = false;
  }

  // Start Workout Button Logic
  document.getElementById('start-workout-btn').addEventListener('click', () => {
      startTimer();
      document.querySelectorAll('.set-complete').forEach(checkbox => {
          checkbox.disabled = false;
      });
      document.getElementById('pause-workout-btn').disabled = false;
      document.getElementById('stop-workout-btn').disabled = false;
      document.getElementById('discard-workout-btn').disabled = false;
  });

  // Pause Workout Button Logic
  document.getElementById('pause-workout-btn').addEventListener('click', () => {
      stopTimer();
      document.getElementById('start-workout-btn').disabled = false;
  });

  // Stop Workout Button Logic
  document.getElementById('stop-workout-btn').addEventListener('click', () => {
      stopTimer();
      displayWorkoutSummary();
  });

  // Discard Workout Button Logic
  document.getElementById('discard-workout-btn').addEventListener('click', () => {
      resetWorkout();
  });

  // Display Detailed Summary
  function displayWorkoutSummary() {
      const workoutSummary = document.getElementById('workout-summary');
      workoutSummary.innerHTML = `
          <h3>Workout Summary</h3>
          <p>Total Weight Lifted: ${totalWeightLifted} kg</p>
          <p>Duration: ${document.getElementById('timer-value').textContent}</p>
      `;
  }

  // Reset Workout
  function resetWorkout() {
      document.getElementById('exercise-list').innerHTML = '';
      totalWeightLifted = 0;
      document.getElementById('total-weight-value').textContent = totalWeightLifted;
      document.getElementById('timer-value').textContent = '00:00';
      document.getElementById('workout-summary').innerHTML = '';
      stopTimer();
  }

  // Navigation
  document.getElementById('home-nav').addEventListener('click', () => {
      showHomeScreen();
  });

  document.getElementById('current-workout-nav').addEventListener('click', () => {
      showCurrentWorkoutScreen();
  });

  function showHomeScreen() {
      document.getElementById('home-screen').classList.remove('hidden');
      document.getElementById('current-workout').classList.add('hidden');
      document.getElementById('home-nav').classList.add('active');
      document.getElementById('current-workout-nav').classList.remove('active');
  }

  function showCurrentWorkoutScreen() {
      document.getElementById('home-screen').classList.add('hidden');
      document.getElementById('current-workout').classList.remove('hidden');
      document.getElementById('home-nav').classList.remove('active');
      document.getElementById('current-workout-nav').classList.add('active');
  }

  showHomeScreen(); // Default to Home screen on load
});
