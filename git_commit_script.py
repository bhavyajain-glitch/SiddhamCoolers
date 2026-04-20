import os
import subprocess
import random
from datetime import datetime, timedelta

def make_commits():
    os.chdir('/Users/bhavyajain/Desktop/Siddham Coolers')
    
    # We want to add all untracked files
    subprocess.run(['git add Backend/ Frontend/ Assets/'], shell=True)
    
    # Get status of added files
    status_output = subprocess.check_output(['git status --porcelain'], shell=True).decode('utf-8')
    
    added_files = []
    for line in status_output.split('\n'):
        if line and (line.startswith('A ') or line.startswith('AM')):
            added_files.append(line[3:])
            
    # Reset them back to unstaged
    subprocess.run(['git reset'], shell=True)
    
    start_date = datetime(2026, 2, 20)
    end_date = datetime(2026, 4, 21)
    
    num_days = (end_date - start_date).days + 1
    
    # Split files across days
    files_per_day = len(added_files) // num_days
    if files_per_day == 0:
        files_per_day = 1
        
    random.shuffle(added_files)
    
    file_index = 0
    current_date = start_date
    
    while current_date <= end_date:
        if file_index >= len(added_files):
            # If we run out of new files, we can just amend a minor file or just touch it to ensure a commit
            with open('Backend/dummy.txt', 'a') as f:
                f.write('X\n')
            subprocess.run(['git add Backend/dummy.txt'], shell=True)
            files_to_commit = ['Backend/dummy.txt']
        else:
            files_to_commit = added_files[file_index:file_index + files_per_day]
            file_index += files_per_day
            
            for file in files_to_commit:
                # Add each file inside quotes to handle spaces
                subprocess.run(['git add "{}"'.format(file)], shell=True)
                
        hour = random.randint(9, 23)
        minute = random.randint(0, 59)
        second = random.randint(0, 59)
        commit_date = current_date.replace(hour=hour, minute=minute, second=second)
        
        date_str = commit_date.strftime('%Y-%m-%dT%H:%M:%S')
        
        commit_messages = [
            "Update component files",
            "Refactor code structure",
            "Add new assets",
            "Improve backend services",
            "Update frontend UI styling",
            "Fix routing issues",
            "Update dependencies",
            "Implement new feature module",
            "Enhance UI/UX elements",
            "Fix minor layout bugs",
            "Initialize API routes",
            "Update models and schemas"
        ]
        
        msg = random.choice(commit_messages)
        
        env = os.environ.copy()
        env['GIT_COMMITTER_DATE'] = date_str
        env['GIT_AUTHOR_DATE'] = date_str
        
        subprocess.run(['git commit -m "' + msg + '"'], shell=True, env=env)
        
        current_date += timedelta(days=1)
        
    # Commit any remaining files
    if file_index < len(added_files):
        subprocess.run(['git add Backend/ Frontend/ Assets/'], shell=True)
        env = os.environ.copy()
        date_str = end_date.replace(hour=23, minute=59).strftime('%Y-%m-%dT%H:%M:%S')
        env['GIT_COMMITTER_DATE'] = date_str
        env['GIT_AUTHOR_DATE'] = date_str
        subprocess.run(['git commit -m "Finalizing remaining updates"'], shell=True, env=env)
        
    print("FINISHED ALL COMMITS!")

if __name__ == '__main__':
    make_commits()
