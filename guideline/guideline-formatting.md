# Guideline

General guideline to follow when developing the application.

<br/><br/>

## General (Frontend)

---

1. **Title Case** for whatever displayed wordings
2. Make sure **transloco** is there
3. Avoid grammatical error
4. Alignment
5. Only show data that are **informative** to user (think from the user journey), not to confuse user, user DO NOT and ARE NOT interested to know the technical details

<br/>

### **Listing**

1. **DO NOT color the cell wording if it is not clickable & redirectable** to another page (avoid confusion)
2. Not need to add `No.` as the first column of the table
3. Make sure the table is **scrollable horizontally** (if there are many columns)
4. If the content of a column **only occupy a certain width, allocate that small amount of width** to that column (e.g: if the content of a column only occupy 100px, then set the width of that column to 100px)
    - Note: Not applicable to extremely dynamic content
5. DateTime format in table column:

<p align="center">
<img src="..\images\standard\datatable-datetime-format.JPG" alt="datatable datetime format" style="zoom:50%;" />
</p>
<br/><br/>

### **Form**

1. Make sure width of fields, left and right padding are consistent
    - Spacing between 2 input fields: 8px `fxLayoutGap='8px'`
    ```html
    <div fxLayout="column" fxLayoutGap="4px" fxLayout.gt-xs="row" fxLayoutAlign.gt-xs="start center" fxLayoutGap.gt-xs="8px">
        <mat-form-field appearance="outline" fxFlex>
            <mat-label>{{ 'customer.name' | transloco }}</mat-label>
            <input disabled matInput [value]="name" />
        </mat-form-field>
        <mat-form-field appearance="outline" fxFlex>
            <mat-label>{{ 'customer.email' | transloco }}</mat-label>
            <input disabled matInput [value]="email" />
        </mat-form-field>
    </div>
    ```
2. **'Save' button is disabled when no value changes** at the very beginning
3. `<mat-select>`: make good use of `enum` as options
4. Constant value (e.g. created_at/date_joined): shown at right panel, if any
   <br/><br/>

### **Input Field**

1. Email:
    - in between there is a '@'
2. Number:
    - ONLY digit is allowed
    - If expected positive (e.g. age, weight, height etc): must check positive
    - Decimal number format
3. Text:

    - For those texts required _long input_ (e.g: address, description): input field spreads a few lines (3-4 lines input, not just 1 line some more half the parent div!!)

    ```javascript
    //use <text-area> instead of <input> for long input
    <text-area></text-area>
    ```

4. New user creation
    - Password must have 2 fields: - one for **‘Password’**, - another for **‘Confirm Password’** &
      other than the common password requirement (a combination of min 8 characters and digits), add a validator to cross check the (i) & (ii), **both must share the exact same value**.
5. Selection Input: order the options by **ASC**

<br/>

### **Button**

1. Button must be disabled and add spinner during loading, if button is link to an API
2. For normal button without linkage to an API, no need disabled and spinner

<br/>

### **Modal**

1. Use FUSE confirmation modal only
2. **For important actions, has a modal popped up and ask the user for double confirmation.**

<br/>

### **Translation**
Here's the translation format applied to the components:


1. `module.component.name`: Component Name
2. `module.component.action.name` Button 
3. `module.component.form.required`: Form
4. `module.component.notification.success` Snackbar Success Notification 
5. `module.component.dialog.title`: Dialog Title
6. `module.enum_option_translate`: Enum Option
<br/><br/><br/>

## General (Backend)

---

### **Python style**
- Use underscores, not camelCase, for variable, function and method names 

```python
# bad
poll.getUniqueVoters()

# good
poll.get_unique_voters()
```

- Use InitialCaps for class names
```python
class MyModel(models.Model):
    DIRECTION_UP = "U"
    DIRECTION_DOWN = "D"
```

<br/>

### **Import Orders in Python Files**

- Put imports in these groups: **standard library, third-party libraries, other Django components, local Django component**. Sort lines in each group alphabetically by the full module name. Place all **import module statements before from module** import objects in each section. Use absolute imports for other Django components and relative imports for local components.

Use a single blank line between the last import and any module level code, and use two blank lines above the first function or class.


```python
# System libraries
import json
from itertools import chain

# Third-party libraries
import bcrypt

# Django
from django.db import IntegrityError, OperationalError, transaction
from django.utils import timezone

# Local Django
from core.models import User
from property.models import Outlet

# Current App module
from .models import Deal, Coupon


class Example:
    ...

```
- Use convenience imports whenever available. For example, do this

```python 
# bad
from django.views.generic.base import View

# good
from django.views import View
```

<br/>

### **URL naming**
URLs are named with small capital letters and with dashes.

```python
# bad
router.register(r'topUpInvoices', TopUpInvoiceViewSet)

# bad
router.register(r'top_up_invoices', TopUpInvoiceViewSet)

# good
router.register(r'top-up-invoices', TopUpInvoiceViewSet)

```

<br/>

### **Model style**
- Field names should be all lowercase, using underscores instead of camelCase.

```python
# bad
class Person(models.Model):
    FirstName = models.CharField(max_length=20)
    Last_Name = models.CharField(max_length=40)

# good
class Person(models.Model):
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=40)
```

- The **class Meta** should appear after the fields are defined, with a single blank line separating the fields and the class definition.

```python
# bad
class Person(models.Model):
    class Meta:
        verbose_name_plural = "people"

    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=40)

# good
class Person(models.Model):
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=40)

    class Meta:
        verbose_name_plural = "people"
```

<br/>

### **Migration File Naming**
- To improve the naming of migration files in Python, it's recommended to use meaningful names that reflect the purpose of the migration. Here's an example of how to improve the naming of migration files:

```python
# bad
0002_auto_20230519.py

# good
0002_alter_maintenancecategory_options.py
```

<br/><br/><br/>

## Before Commit/Push Your Changes to Remote Server

---

1. Use **meaningful variable names** and Say NO to Magic Number!!
    - Use ENUM status defined in the model.ts file instead of using magic number
2. Make sure the **logic is correct**
3. Check **responsiveness** (mobile, tablet, desktop) after completing the desktop view
4. Format your code
    - Backend (Python): PyCharm (just a recommendation)
5. Remove unused code - imports, variables, functions
6. Remove console.log()
7. Test your code

    - Make sure your code is working as expected (e.g: no error at console / during API call). Possible examples:
        - make sure datatable is able to scroll horizontally, `per_page` parameter is correct etc
    - Make sure your code is **not breaking other parts** of the application

    ```
    Sorrowful feedbacks from our anonymous colleagues:
    - PLEASE DONT PUSH UNCOMPLETED CODE LIKE FUNCTION CANNOT WORK, BUTTON CANNOT CLICK OR CONSOLE THERE”S ALOT OF RED STUFF
    - PLEASE MAKE SURE YOUR CODE LOGIC IS WORK BEFORE PUSH
    ```

8. Once all good, viola! You are ready to commit/push your changes to remote server. **Do not push your changes to remote server if you are not sure about your code.** Additionally, remember not to include sensitive information, such as **credentials**, when committing changes to GitHub

<p align="center">
<img src="..\images\meme\git-push-and-run-banned.jpg" alt="git push and run banned" style="zoom:50%;" />
</p>
